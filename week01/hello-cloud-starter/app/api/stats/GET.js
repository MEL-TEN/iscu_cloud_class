import { authenticate } from "../../../lib/auth";
import { authorize } from "../../../lib/authorization";
import { getSummaryStats, getTopUrl, getUrlStats } from "../../../lib/stats";
import { authenticationRequiredResponse, forbiddenResponse } from "./route";


export async function GET(request) {
    const user = authenticate(request);
    if (!user) return authenticationRequiredResponse();
    if (!authorize(user, "stats:read")) return forbiddenResponse();
    try {
        const summary = await getSummaryStats();
        const topUrl = await getTopUrl();
        const urls = await getUrlStats();

        // summary, topUrl, urls를 하나의 JSON 응답으로 반환하세요.
        // README의 목표 JSON 구조를 참고하세요.
        return Response.json(
            {
                summary: {
                    totalUrls: summary.totalUrls,
                    totalClicks: summary.totalClicks,
                    clickedUrls: summary.clickedUrls,
                    topUrl: topUrl,
                },
                urls: urls,
            },
            {
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );

    } catch (error) {
        console.error("Failed to load stats", error);

        return Response.json(
            {
                error: {
                    code: "STATS_ERROR",
                    message: "Failed to load stats.",
                },
            },
            {
                status: 500,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    }
}
