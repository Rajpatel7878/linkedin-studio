import { GeneratedDraftOption, PostAngle, PostTone, VoiceProfileItem, ContentTemplateItem } from '@/types';
import { ANGLE_DEFINITIONS, TONE_DEFINITIONS } from './promptBuilder';

export function generateSmartFallbackDrafts(
  topic: string,
  angles: PostAngle[] = ['storytelling', 'listicle', 'bold-hook'],
  targetAudience?: string,
  keyTakeaway?: string,
  voiceProfile?: VoiceProfileItem | null,
  template?: ContentTemplateItem | null
): GeneratedDraftOption[] {
  const cleanTopic = topic.trim();
  const audience = targetAudience || 'builders and leaders';
  const coreValue = keyTakeaway || 'consistency and authentic value create compounding leverage';

  return angles.map((angle) => {
    let hook = '';
    let body = '';
    let hashtags: string[] = ['#Leadership', '#Strategy', '#FutureOfWork'];
    let tone: PostTone = 'professional';

    if (template) {
      // Structure filled via template
      hook = template.hookPattern.replace('[Topic]', cleanTopic).replace('[Target Audience]', audience);
      const templateBody = template.bodyPattern
        .replace(/\[Topic\]/g, cleanTopic)
        .replace(/\[Target Audience\]/g, audience)
        .replace(/\[Core Value\]/g, coreValue)
        .replace(/\[Key lesson 1\]/g, 'Double down on high-leverage focus')
        .replace(/\[Key lesson 2\]/g, 'Talk to real users before writing code')
        .replace(/\[Key lesson 3\]/g, 'Measure outcomes, not vanity activity');

      body = `${hook}\n\n${templateBody}\n\n${template.ctaPattern.replace('[industry/niche]', cleanTopic)}\n\n#Leadership #Growth #BuildingInPublic #Strategy`;
    } else if (angle === 'storytelling') {
      tone = 'story';
      hook = `3 years ago, I made a mistake around ${cleanTopic} that almost cost us everything:`;
      body = `${hook}

I remember staring at my dashboard feeling completely paralyzed.

I was following the traditional playbook:
❌ Trying to do 10 things at once
❌ Prioritizing vanity metrics over real retention
❌ Avoiding the hard, uncomfortable conversations

Then we made one critical pivot:
We decided to focus entirely on ${coreValue}.

The result?
→ Noise disappeared
→ Daily compound momentum replaced constant firefighting
→ Revenue and retention tripled in 6 months

Failure is only wasted if you don't extract the lesson.

Have you ever had to unlearn a conventional habit the hard way? What was your turning point?

#PersonalJourney #Leadership #Founders #Productivity #CareerGrowth`;
      hashtags = ['#PersonalJourney', '#Leadership', '#Founders', '#Productivity'];
    } else if (angle === 'listicle') {
      tone = 'educational';
      hook = `5 non-obvious rules for mastering ${cleanTopic} (bookmark this for later): 🧠`;
      body = `${hook}

Most people spend years figuring this out. Here is the short version:

1️⃣ Clarify Your Highest-Leverage Move
80% of results come from 20% of inputs. For us, that means ${coreValue}.

2️⃣ Kill Zero-Value Meetings
Protect deep uninterrupted blocks of focus every single morning.

3️⃣ Document the Messy Learnings
Share what broke and how you fixed it, not just the polished highlight reel.

4️⃣ Measure Shipped Impact Over Hours
The market rewards shipped solutions, not late-night Slack presence.

5️⃣ Build Compounding Systems
Consistency beats erratic intensity every single time.

💡 Takeaway for ${audience}:
You don't need a 40-slide strategy. You just need clear execution.

Which of these 5 principles is your team focusing on this quarter?

#Frameworks #ContinuousImprovement #SystemsThinking #Efficiency #Strategy`;
      hashtags = ['#Frameworks', '#ContinuousImprovement', '#SystemsThinking', '#Strategy'];
    } else {
      // bold-hook
      tone = 'bold';
      hook = `Unpopular opinion: 90% of advice around ${cleanTopic} is completely backwards.`;
      body = `${hook}

Every influencer tells you to chase quick hacks and vanity growth.

Here is the uncomfortable truth:
Shortcuts create fragility. Deep compounding fundamentals create monopolies.

If you actually want to stand out:
→ Stop trying to please everyone
→ Double down on ${coreValue}
→ Execute quietly when nobody is clapping
→ Build assets that work while you sleep

The market doesn't reward intentions. It rewards execution.

Agree or disagree? What’s your contrarian take on ${cleanTopic}?

#GrowthMindset #Strategy #FutureOfWork #Leadership #Execution`;
      hashtags = ['#GrowthMindset', '#Strategy', '#FutureOfWork', '#Execution'];
    }

    const charCount = body.length;
    const words = body.split(/\s+/).length;
    const readMinutes = Math.max(1, Math.round(words / 180));
    const seeMoreCutoff = Math.min(210, body.length);

    return {
      angle,
      angleLabel: ANGLE_DEFINITIONS[angle]?.label || angle,
      tone,
      toneLabel: TONE_DEFINITIONS[tone]?.label || tone,
      hook,
      content: body,
      characterCount: charCount,
      seeMoreIndex: seeMoreCutoff,
      estimatedReadTime: `${readMinutes} min read`,
      suggestedHashtags: hashtags,
    };
  });
}
