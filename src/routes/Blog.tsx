import React, { useEffect, useState } from 'react';
import { posts } from '../blog';

interface LoadedPostMeta {
  slug?: string;
  title?: string;
  summary?: string;
  published?: string;
  tags?: string[];
  default: React.ComponentType<any>;
}

export default function Blog() {
  const [loaded, setLoaded] = useState<LoadedPostMeta[]>([]);
  const [active, setActive] = useState<LoadedPostMeta | null>(null);

  useEffect(() => {
    Promise.all(posts.map(fn => fn())).then(mods => {
      const metas = mods.map(m => m as unknown as LoadedPostMeta);
      setLoaded(metas);
    });
  }, []);

  return (
    <div>
      <h1>Blog</h1>
      <p>Select a post to view inline (temporary simple renderer).</p>
      <ul>
        {loaded.map(mod => (
          <li key={mod.slug || mod.title}>
            <button onClick={() => setActive(mod)} style={{ cursor: 'pointer' }}>
              {mod.title || mod.slug}
            </button>
          </li>
        ))}
      </ul>
      <hr />
      {active && (
        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}>
          <h2>{active.title}</h2>
          <active.default />
        </div>
      )}
    </div>
  );
}
