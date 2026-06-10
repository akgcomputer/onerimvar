// /functions/api/state.ts

export async function onRequestGet(context: any) {
  const db = context.env.DB;
  
  try {
    // 1. Fetch site settings
    const settingsResult = await db.prepare("SELECT key, value FROM site_settings").all();
    const siteSettings: Record<string, string> = {};
    settingsResult.results.forEach((row: any) => {
      siteSettings[row.key] = row.value;
    });

    // 2. Fetch weekly poll
    const weeklyPoll = await db.prepare("SELECT * FROM weekly_poll LIMIT 1").first();

    // 3. Fetch report stats
    const reportStats = await db.prepare("SELECT * FROM report_stats LIMIT 1").first();

    // 4. Fetch business candidates
    const candidatesResult = await db.prepare("SELECT * FROM business_candidates WHERE approved = 1 ORDER BY votes DESC").all();
    const businessCandidates = candidatesResult.results.map((row: any) => ({
      id: row.id,
      icon: row.icon,
      name: row.name,
      votes: row.votes,
      sector: row.sector,
      category: row.category,
      region: row.region,
      about: row.about,
      vision: row.vision,
      budgetCommitment: row.budget_commitment,
      createdAt: row.created_at
    }));

    // 5. Fetch leagues
    const leaguesResult = await db.prepare("SELECT * FROM leagues").all();
    const leagues: Record<string, any[]> = {
      efsaneOneriler: [],
      efsaneIsletmeler: [],
      yogunSikayetalanlar: [],
      kayitsizKalanlar: []
    };
    leaguesResult.results.forEach((row: any) => {
      if (leagues[row.category]) {
        leagues[row.category].push({
          id: row.id,
          name: row.name,
          metricLabel: row.metric_label,
          metricValue: row.metric_value,
          percent: row.percent
        });
      }
    });

    // 6. Fetch feed items
    const feedResult = await db.prepare("SELECT * FROM feed_items ORDER BY created_at DESC").all();
    const feedItems = feedResult.results.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      author: row.author,
      institution: row.institution,
      category: row.category,
      votes: row.votes,
      commentsCount: row.comments_count,
      createdAt: row.created_at,
      status: row.status,
      targetSector: row.target_sector,
      signatureGoal: row.signature_goal || undefined,
      currentSignatures: row.current_signatures || undefined,
      approved: row.approved === 1,
      visibility: row.visibility || undefined,
      pollScope: row.poll_scope || undefined,
      pollRegion: row.poll_region || undefined,
      pollResultType: row.poll_result_type || undefined,
      pollOptions: row.poll_options ? JSON.parse(row.poll_options) : undefined,
      smsActivated: row.sms_activated === 1
    }));

    const state = {
      weeklyPoll: weeklyPoll ? {
        id: weeklyPoll.id,
        question: weeklyPoll.question,
        votesYes: weeklyPoll.votes_yes,
        votesUndecided: weeklyPoll.votes_undecided,
        votesNo: weeklyPoll.votes_no
      } : {
        id: "weekly-1",
        question: "Anket bulunamadı",
        votesYes: 0,
        votesUndecided: 0,
        votesNo: 0
      },
      businessCandidates,
      reportPdfName: reportStats ? reportStats.pdf_name : "Turkiye_Dijital_Itibar_ve_Katilim_Raporu_2026.pdf",
      reportDownloadsCount: reportStats ? reportStats.downloads_count : 0,
      leagueMode: reportStats ? reportStats.league_mode : "Auto",
      leagues,
      feedItems,
      siteSettings
    };

    return new Response(JSON.stringify(state), {
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
