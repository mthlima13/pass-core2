import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-icon" />
        <div className="skeleton-lines">
          <div className="skeleton-line skeleton-line--lg" />
          <div className="skeleton-line skeleton-line--sm" />
        </div>
      </div>
      <div className="skeleton-body">
        <div className="skeleton-field" />
        <div className="skeleton-field" />
      </div>
      <div className="skeleton-footer">
        <div className="skeleton-btn" />
        <div className="skeleton-btn" />
        <div className="skeleton-btn" />
      </div>
    </div>
  );
}
