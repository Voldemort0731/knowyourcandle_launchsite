require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

async function testSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("URL:", supabaseUrl);
  console.log("Key prefix:", supabaseServiceKey ? supabaseServiceKey.substring(0, 10) + "..." : "missing");

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .upsert(
      { 
        email: "test@example.com", 
        status: "active",
        razorpay_payment_id: "pay_test123"
      },
      { onConflict: "email" }
    );

  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("Supabase Success! Inserted test row.");
  }
}

testSupabase();
