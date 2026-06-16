import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return NextResponse.json(
        { error: "Invalid signature or missing secret" },
        { status: 400 }
      );
    }

    // Verify the signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    // The payload is authentic
    const body = JSON.parse(rawBody);

    // We only care about payment.captured or order.paid events
    const event = body.event;
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = body.payload.payment.entity;
      
      // Razorpay payment pages usually store customer email here
      const customerEmail = paymentEntity.email;
      
      if (customerEmail) {
        // Upsert into Supabase
        const { error } = await supabaseAdmin
          .from("subscriptions")
          .upsert(
            { 
              email: customerEmail, 
              status: "active",
              razorpay_payment_id: paymentEntity.id
            },
            { onConflict: "email" }
          );

        if (error) {
          console.error("Supabase upsert error:", error);
          return NextResponse.json({ error: "Failed to save to database" }, { status: 500 });
        }

        console.log(`Successfully activated subscription for: ${customerEmail}`);
      } else {
        console.warn("Webhook received but no email found in payload");
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("Webhook processing error:", error.message);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
