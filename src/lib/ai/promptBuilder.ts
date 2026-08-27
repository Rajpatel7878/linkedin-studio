import { VoiceProfileItem, PostTone, PostAngle, ContentTemplateItem } from '@/types';

export const ANGLE_DEFINITIONS: Record<PostAngle, { label: string; description: string; emoji: string }> = {
  storytelling: {
    label: 'Storytelling Narrative',
    description: 'Personal journey, vulnerability, turning point, and leadership takeaway.',
    emoji: '📖',
  },
  listicle: {
    label: 'Listicle & Actionable Bullets',
    description: 'Step-by-step breakdown, numbered insights, framework checklists, instant value.',
    emoji: '🔢',
  },
  'bold-hook': {
    label: 'Bold Scroll-Stopping Hook',
    description: 'Provocative contrarian take, challenges conventional advice, creates strong curiosity gap.',
    emoji: '🔥',
  },
};

export const TONE_DEFINITIONS: Record<PostTone, { label: string; description: string; emoji: string }> = {
  professional: {
    label: 'Professional & Authoritative',
    description: 'Clear, insightful, structured, industry-expert perspective with balanced nuance.',
    emoji: '💼',
  },
  bold: {
    label: 'Bold & Disruptive',
    description: 'Provocative contrarian take, strong hook, challenges conventional wisdom, energetic tone.',
    emoji: '🔥',
  },
  casual: {
    label: 'Casual & Conversational',
    description: 'Approachable, friendly, storytelling vibe, relatable language, humble yet smart.',
    emoji: '☕',
  },
  story: {
    label: 'Personal Story & Lesson',
    description: 'Narrative arc: challenge, turning point, actionable lesson.',
    emoji: '📖',
  },
  educational: {
    label: 'Actionable Framework',
    description: 'Step-by-step breakdown, bullet points, checklists, zero fluff.',
    emoji: '🧠',
  },
};

export function buildSystemPrompt(voiceProfile?: VoiceProfileItem | null, template?: ContentTemplateItem | null): string {
  let prompt = `You are an elite LinkedIn content ghostwriter and viral engagement strategist.
Your mission is to craft authentic, engaging, and high-performing LinkedIn posts that drive meaningful discussions and establish authority.

### LinkedIn Content Rules:
1. HOOK IS EVERYTHING: The first 1-2 lines (under 210 characters) determine if the reader clicks "...see more". Make it irresistibly curious, bold, or relatable. Never use clichés like "I am thrilled to announce" or "In today's fast-paced world".
2. READABILITY: Use short 1-2 sentence paragraphs with clear line breaks between thoughts. Use clean bullet points (• or → or 💡) for lists.
3. SUBSTANCE: Deliver concrete insights, specific numbers, hard-won lessons, or counterintuitive truths.
4. ENGAGEMENT CATALYST: End with a genuine, low-friction, open-ended question that prompts comments.
5. HASHTAGS: Provide 3-5 relevant, focused hashtags at the very bottom.
6. NO CORPORATE JARGON: Avoid buzzwords like "synergy", "paradigm shift", "leverage", "deep dive" unless intentional.`;

  if (template) {
    prompt += `\n\n### CONTENT TEMPLATE STRUCTURE TO ADAPT:
Template Name: ${template.name}
Description: ${template.description}
- Hook Style Pattern: ${template.hookPattern}
- Body Pattern: ${template.bodyPattern}
- CTA Pattern: ${template.ctaPattern}
Adapt this proven structure smoothly to the user's specific topic!`;
  }

  if (voiceProfile) {
    prompt += `\n\n### USER VOICE MATCHING & STYLE DNA:
Adopt the specific writing style and rhythm of this author:
- Voice Profile Name: ${voiceProfile.name}
${voiceProfile.instructions ? `- Author Guidelines: ${voiceProfile.instructions}` : ''}
${voiceProfile.styleSummary ? `- Stylistic DNA: ${voiceProfile.styleSummary}` : ''}`;

    if (voiceProfile.samples && voiceProfile.samples.length > 0) {
      prompt += `\n\n### FEW-SHOT WRITING EXAMPLES FROM THIS AUTHOR:`;
      voiceProfile.samples.forEach((sample, idx) => {
        prompt += `\n\n--- [Example ${idx + 1}: ${sample.title}] ---\n${sample.content}\n--- [End Example ${idx + 1}] ---`;
      });
      prompt += `\n\nMatch this author's exact voice, cadence, and formatting style!`;
    }
  }

  return prompt;
}

export function buildGenerationUserPrompt(params: {
  topic: string;
  angles: PostAngle[];
  targetAudience?: string;
  keyTakeaway?: string;
  callToAction?: string;
  customInstructions?: string;
  length?: string;
}): string {
  const anglesList = params.angles
    .map((a) => `- ${a.toUpperCase()}: ${ANGLE_DEFINITIONS[a]?.description || a}`)
    .join('\n');

  return `Please generate ${params.angles.length} distinct LinkedIn post drafts for the topic below, one for each requested angle (Storytelling, Listicle, Bold Hook).

TOPIC / IDEA:
"${params.topic}"

${params.targetAudience ? `TARGET AUDIENCE: ${params.targetAudience}` : ''}
${params.keyTakeaway ? `KEY TAKEAWAY: ${params.keyTakeaway}` : ''}
${params.callToAction ? `DESIRED CTA: ${params.callToAction}` : ''}
${params.customInstructions ? `SPECIAL INSTRUCTIONS: ${params.customInstructions}` : ''}

REQUESTED ANGLES:
${anglesList}

OUTPUT FORMAT:
Output ONLY a strictly valid JSON object with the following schema:
{
  "drafts": [
    {
      "angle": "storytelling | listicle | bold-hook",
      "angleLabel": "Human Friendly Angle Label",
      "tone": "professional | bold | casual",
      "toneLabel": "Human Friendly Tone Label",
      "hook": "The single opening line hook before see more cutoff",
      "content": "Full LinkedIn post text formatted with proper line breaks (\\n\\n) and bullet points and ending with 3-5 hashtags",
      "suggestedHashtags": ["#Tag1", "#Tag2", "#Tag3"]
    }
  ]
}

Ensure the output is ONLY the JSON object.`;
}
