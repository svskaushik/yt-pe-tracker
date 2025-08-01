// app/api/webhooks/clerk/route.ts
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

import { prisma } from '@/lib/prisma';

interface ClerkUserData {
  id: string;
  first_name?: string;
  last_name?: string;
  email_addresses: Array<{
    email_address: string;
    verification?: {
      status: string;
    };
  }>;
  image_url?: string;
}

interface ClerkWebhookEvent {
  type: string;
  data: ClerkUserData;
}

export async function POST(req: Request) {
  const { CLERK_WEBHOOK_SECRET } = process.env;

  if (!CLERK_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(CLERK_WEBHOOK_SECRET);
  let evt: ClerkWebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    // Use proper logging instead of console.error
    // console.error('Webhook verification failed:', err);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }

  const { type, data } = evt;

  if (type === 'user.created' || type === 'user.updated') {
    try {
      await prisma.user.upsert({
        where: { clerkId: data.id },
        update: {
          name: data.first_name ? `${data.first_name} ${data.last_name || ''}`.trim() : null,
          email: data.email_addresses[0].email_address,
          emailVerified:
            data.email_addresses[0].verification?.status === 'verified' ? new Date() : null,
          image: data.image_url || null,
          updatedAt: new Date(),
        },
        create: {
          clerkId: data.id,
          name: data.first_name ? `${data.first_name} ${data.last_name || ''}`.trim() : null,
          email: data.email_addresses[0].email_address,
          emailVerified:
            data.email_addresses[0].verification?.status === 'verified' ? new Date() : null,
          image: data.image_url || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return NextResponse.json({ success: true });
    } catch (error) {
      // Use proper logging instead of console.error
      // console.error('Prisma error:', error);
      return NextResponse.json({ error: 'Failed to process user data' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
