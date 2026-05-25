// DesignNotes: a wrapping cloud of small "tag" chips that rotates through the
// accent palette to create a colorful, lightweight inventory of design values.
// The fixed cream chrome matches sibling snapshot cards so they read as one set.

import React from 'react';

const tags = [
  '[YOUR_DESIGN_TAG_1]',
  '[YOUR_DESIGN_TAG_2]',
  '[YOUR_DESIGN_TAG_3]',
  '[YOUR_DESIGN_TAG_4]',
  '[YOUR_DESIGN_TAG_5]',
  '[YOUR_DESIGN_TAG_6]',
  '[YOUR_DESIGN_TAG_7]',
  '[YOUR_DESIGN_TAG_8]',
  '[YOUR_DESIGN_TAG_9]',
  '[YOUR_DESIGN_TAG_10]',
  '[YOUR_DESIGN_TAG_11]',
  '[YOUR_DESIGN_TAG_12]',
];

const defaults = [
  'typography',
  'motion',
  'color',
  'grid',
  'whitespace',
  'icons',
  'spacing',
  'contrast',
  'details',
  'voice',
  'rhythm',
  'ink',
];

const accentBgs = [
  'bg-accent-yellow',
  'bg-accent-mint',
  'bg-accent-coral',
  'bg-accent-lilac',
  'bg-accent-sky',
];

function DesignNotes() {
  return (
    <div className="bg-cream-50 border border-ink-900/10 rounded-lg p-4">
      <div className="font-mono text-xs uppercase tracking-wider text-ink-900/60 mb-3">
        Design notes
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <div
            key={i}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border border-ink-900/10 text-ink-900 ${accentBgs[i % accentBgs.length]}`}
            title={tag}
          >
            {defaults[i]}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DesignNotes;
