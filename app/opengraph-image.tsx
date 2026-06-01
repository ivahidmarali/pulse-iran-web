import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "پالس ایران — اخبار فوری ایران و جهان";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #0d1214 0%, #101415 50%, #0a1618 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow orb top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(60,215,255,0.12) 0%, transparent 70%)",
          }}
        />
        {/* Glow orb bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(60,215,255,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Grid lines decoration */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(60,215,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(60,215,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Pulse dot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#3cd7ff",
              boxShadow: "0 0 16px rgba(60,215,255,0.8)",
            }}
          />
          <span style={{ color: "#3cd7ff", fontSize: 18, letterSpacing: 3, textTransform: "uppercase" }}>
            PULSE IRAN
          </span>
        </div>

        {/* Main logo */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: -2,
            marginBottom: 20,
            textShadow: "0 0 60px rgba(60,215,255,0.3)",
          }}
        >
          پالس ایران
        </div>

        {/* Divider */}
        <div
          style={{
            width: 120,
            height: 3,
            background: "linear-gradient(90deg, transparent, #3cd7ff, transparent)",
            marginBottom: 24,
            borderRadius: 2,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#a2e7ff",
            fontWeight: 400,
            letterSpacing: 1,
          }}
        >
          اخبار فوری ایران و جهان
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 15 }}>palsiran.com</span>
          <span style={{ color: "rgba(60,215,255,0.4)", fontSize: 15 }}>·</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 15 }}>۴۵+ منبع خبری</span>
          <span style={{ color: "rgba(60,215,255,0.4)", fontSize: 15 }}>·</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 15 }}>بی‌طرف</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
