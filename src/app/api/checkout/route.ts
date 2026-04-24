export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { plan, billingAnnual } = await req.json(); // "PRO" or "PREMIUM"
    
    // In a real app, these should be from your Stripe Dashboard Products
    // Below are mockup price amounts assuming BRL currency
    const isAnnual = !!billingAnnual;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
        return new NextResponse('User not found', { status: 404 });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/?checkout=success` : 'http://localhost:3000/?checkout=success',
      cancel_url: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/?checkout=cancel` : 'http://localhost:3000/?checkout=cancel',
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.email!,
      line_items: [
        {
          price_data: {
            currency: 'BRL',
            product_data: {
              name: plan === 'PREMIUM' ? `EasyList Premium - Equipe & IA (${isAnnual ? 'Anual' : 'Mensal'})` : `EasyList Pro - Produtividade Avançada (${isAnnual ? 'Anual' : 'Mensal'})`,
              description: plan === 'PREMIUM' ? 'Produtividade em equipe e IA. Até 5 usuários.' : 'Tarefas, projetos e rotinas ilimitados.'
            },
            unit_amount: plan === 'PREMIUM' ? (isAnnual ? 57480 : 5990) : (isAnnual ? 28680 : 2990), // in cents
            recurring: {
                interval: isAnnual ? 'year' : 'month'
            }
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        plan: plan,
        billingCycle: isAnnual ? 'yearly' : 'monthly'
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('STRIPE_CHECKOUT_ERROR', error);
    return new NextResponse(error instanceof Error ? error.message : 'Internal Error', { status: 500 });
  }
}
