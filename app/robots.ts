import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/enrolment/",
          "/student-dashboard/",
          "/student-login",
          "/onboarding/",
          "/login",
          "/signup",
          "/verified",
        ],
      },
    ],
    sitemap: "https://www.ngarupou.org.au/sitemap.xml",
  };
}
