export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed.', error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    if (event.type === 'checkout.session.completed') {
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan; // 'PRO' or 'PREMIUM'
      const customerId = session.customer as string;

      if (userId && plan) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: plan as any,
            stripeCustomerId: customerId as any,
          } as any,
        });
        console.log(`User ${userId} upgraded to ${plan}`);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId } as any,
        data: { plan: 'FREE' } as any,
      });
      console.log(`Customer ${customerId} subscription deleted. Downgraded to FREE.`);
    }

    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const status = subscription.status;
      // If paused or incomplete_expired, downgrade
      if (status === 'paused' || status === 'incomplete_expired' || status === 'canceled') {
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId } as any,
          data: { plan: 'FREE' } as any,
        });
        console.log(`Customer ${customerId} subscription updated to ${status}. Downgraded to FREE.`);
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Webhook handler failed.', error);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}
