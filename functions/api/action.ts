// /functions/api/action.ts

export async function onRequestPost(context: any) {
  const db = context.env.DB;
  
  try {
    const body = await context.request.json();
    const { type, payload } = body;

    if (type === "voteWeekly") {
      const { option } = payload;
      if (option === "Yes") {
        await db.prepare("UPDATE weekly_poll SET votes_yes = votes_yes + 1 WHERE id = 'weekly-1'").run();
      } else if (option === "Undecided") {
        await db.prepare("UPDATE weekly_poll SET votes_undecided = votes_undecided + 1 WHERE id = 'weekly-1'").run();
      } else if (option === "No") {
        await db.prepare("UPDATE weekly_poll SET votes_no = votes_no + 1 WHERE id = 'weekly-1'").run();
      }
    } 
    else if (type === "voteBusiness") {
      const { candidateId } = payload;
      await db.prepare("UPDATE business_candidates SET votes = votes + 1 WHERE id = ?").bind(candidateId).run();
    }
    else if (type === "downloadReport") {
      await db.prepare("UPDATE report_stats SET downloads_count = downloads_count + 1 WHERE id = 'report-1'").run();
    }
    else if (type === "addFeedItem") {
      const { item } = payload;
      await db.prepare(`
        INSERT INTO feed_items (
          id, title, description, author, institution, category, votes, comments_count, 
          created_at, status, target_sector, signature_goal, current_signatures, approved, 
          visibility, poll_scope, poll_region, poll_result_type, poll_options, sms_activated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        item.id,
        item.title,
        item.description,
        item.author,
        item.institution,
        item.category,
        item.votes || 1,
        0,
        item.createdAt,
        item.status,
        item.targetSector || null,
        item.signatureGoal || null,
        item.currentSignatures || null,
        item.approved ? 1 : 0,
        item.visibility || null,
        item.pollScope || null,
        item.pollRegion || null,
        item.pollResultType || null,
        item.pollOptions ? JSON.stringify(item.pollOptions) : null,
        item.smsActivated ? 1 : 0
      ).run();
    }
    else if (type === "voteFeedItem") {
      const { id } = payload;
      await db.prepare("UPDATE feed_items SET votes = votes + 1 WHERE id = ?").bind(id).run();
    }
    else if (type === "signCampaign") {
      const { id } = payload;
      await db.prepare("UPDATE feed_items SET current_signatures = current_signatures + 1 WHERE id = ?").bind(id).run();
    }
    else if (type === "voteFeedOption") {
      const { feedId, optionIndex } = payload;
      const item = await db.prepare("SELECT poll_options FROM feed_items WHERE id = ?").bind(feedId).first();
      if (item && item.poll_options) {
        const opts = JSON.parse(item.poll_options);
        if (opts[optionIndex]) {
          opts[optionIndex].votes += 1;
          await db.prepare("UPDATE feed_items SET poll_options = ?, votes = votes + 1 WHERE id = ?")
            .bind(JSON.stringify(opts), feedId).run();
        }
      }
    }
    else if (type === "updateFeedStatus") {
      const { feedId, newStatus } = payload;
      await db.prepare("UPDATE feed_items SET status = ? WHERE id = ?").bind(newStatus, feedId).run();
    }
    else if (type === "updatePollQuestion") {
      const { newQuestion } = payload;
      await db.prepare("UPDATE weekly_poll SET question = ?, votes_yes = 0, votes_undecided = 0, votes_no = 0 WHERE id = 'weekly-1'").bind(newQuestion).run();
    }
    else if (type === "updateReportPdf") {
      const { newName } = payload;
      await db.prepare("UPDATE report_stats SET pdf_name = ? WHERE id = 'report-1'").bind(newName).run();
    }
    else if (type === "resetReportDownloads") {
      await db.prepare("UPDATE report_stats SET downloads_count = 0 WHERE id = 'report-1'").run();
    }
    else if (type === "toggleLeagueMode") {
      await db.prepare("UPDATE report_stats SET league_mode = CASE WHEN league_mode = 'Auto' THEN 'Manuel' ELSE 'Auto' END WHERE id = 'report-1'").run();
    }
    else if (type === "addLeagueItem") {
      const { category, item } = payload;
      await db.prepare("INSERT INTO leagues (id, category, name, metric_label, metric_value, percent) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(item.id, category, item.name, item.metricLabel, item.metricValue, item.percent).run();
    }
    else if (type === "removeLeagueItem") {
      const { category, itemId } = payload;
      await db.prepare("DELETE FROM leagues WHERE category = ? AND id = ?").bind(category, itemId).run();
    }
    else if (type === "resetPollVotes") {
      await db.prepare("UPDATE weekly_poll SET votes_yes = 0, votes_undecided = 0, votes_no = 0 WHERE id = 'weekly-1'").run();
    }
    else if (type === "updateSiteSettings") {
      const { settings } = payload;
      for (const [key, value] of Object.entries(settings)) {
        await db.prepare("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)").bind(key, String(value)).run();
      }
    }
    else if (type === "deleteFeedItem") {
      const { id } = payload;
      await db.prepare("DELETE FROM feed_items WHERE id = ?").bind(id).run();
    }
    else if (type === "updateFeedItem") {
      const { id, updated } = payload;
      for (const [key, value] of Object.entries(updated)) {
        let dbKey = key;
        if (key === "commentsCount") dbKey = "comments_count";
        else if (key === "targetSector") dbKey = "target_sector";
        else if (key === "signatureGoal") dbKey = "signature_goal";
        else if (key === "currentSignatures") dbKey = "current_signatures";
        else if (key === "smsActivated") dbKey = "sms_activated";
        
        let dbValue: any = value;
        if (typeof value === "boolean") dbValue = value ? 1 : 0;
        else if (key === "pollOptions") dbValue = JSON.stringify(value);

        await db.prepare(`UPDATE feed_items SET ${dbKey} = ? WHERE id = ?`).bind(dbValue, id).run();
      }
    }
    else if (type === "approveUser") {
      const { id } = payload;
      await db.prepare("UPDATE users SET approved = 1 WHERE id = ?").bind(id).run();
    }
    else if (type === "approveBusiness") {
      const { id } = payload;
      await db.prepare("UPDATE businesses SET approved = 1 WHERE id = ?").bind(id).run();
      await db.prepare("UPDATE business_candidates SET approved = 1 WHERE id = ?").bind(id).run();
    }
    else if (type === "deleteUser") {
      const { id } = payload;
      await db.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
    }
    else if (type === "deleteBusiness") {
      const { id } = payload;
      await db.prepare("DELETE FROM businesses WHERE id = ?").bind(id).run();
      await db.prepare("DELETE FROM business_candidates WHERE id = ?").bind(id).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
