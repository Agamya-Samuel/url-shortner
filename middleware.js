import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
	// Handle redirect routes directly in middleware - bypass page rendering
	const url = req.nextUrl;
	const pathname = url.pathname;
	
	// Check if this is a redirect route (short URL)
	// Pattern: /[id] where id is not a known route like /dashboard, /api, etc.
	const isRedirectRoute = pathname.match(/^\/[^\/]+$/) &&
		!pathname.startsWith('/dashboard') &&
		!pathname.startsWith('/api') &&
		!pathname.startsWith('/sign-in') &&
		!pathname.startsWith('/sign-up') &&
		pathname !== '/';
	
	if (isRedirectRoute) {
		// Extract the ID from the path
		const id = pathname.slice(1);
		// Redirect to API route which handles analytics and redirect
		return NextResponse.redirect(new URL(`/api/${id}`, req.url));
	}
	
	if (isProtectedRoute(req)) await auth.protect;
});

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
