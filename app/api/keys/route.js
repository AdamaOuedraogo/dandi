import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

// Generate a unique API key
function generateApiKey() {
  return "Dandi-" + crypto.randomBytes(32).toString("hex");
}

export async function GET() {
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log(
    "Supabase Key exists:",
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function POST(request) {
  try {
    const { name, limit } = await request.json();
    const apiKey = generateApiKey();

    const { data, error } = await supabase
      .from("api_keys")
      .insert([
        {
          name,
          key: apiKey,
          monthly_limit: limit || null,
          usage: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return new NextResponse(
        JSON.stringify({ error: "Failed to create API key" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating API key:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const { error } = await supabase.from("api_keys").delete().eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return new NextResponse(
        JSON.stringify({ error: "Failed to delete API key" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error deleting API key:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Add update endpoint for usage tracking
export async function PATCH(request) {
  try {
    const { id, usage } = await request.json();

    const { data, error } = await supabase
      .from("api_keys")
      .update({ usage })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating API key usage:", error);
    return NextResponse.json(
      { error: "Failed to update API key usage" },
      { status: 500 }
    );
  }
}
