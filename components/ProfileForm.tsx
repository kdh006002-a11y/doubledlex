"use client";

import { useState } from "react";
import { NEIGHBORHOOD_LABELS } from "@/lib/geo";
import { emptyProfile, saveProfile, type Profile } from "@/lib/profile";

const AVATARS = ["🥕", "🐰", "🦊", "🐻", "🐼", "🐨", "🐶", "🐱", "🦁", "🐯"];

/**
 * 계정 만들기 / 프로필 수정 폼.
 * 지갑 주소는 외부에서 받아 식별자로 쓴다(편집 불가).
 */
export function ProfileForm({
  address,
  initial,
  onSaved,
  onCancel,
}: {
  address: string;
  initial?: Profile;
  onSaved: (p: Profile) => void;
  onCancel?: () => void;
}) {
  const base = initial ?? emptyProfile(address);
  const [nickname, setNickname] = useState(base.nickname);
  const [neighborhood, setNeighborhood] = useState(
    base.neighborhood || NEIGHBORHOOD_LABELS[0]
  );
  const [avatarEmoji, setAvatarEmoji] = useState(base.avatarEmoji);
  const [bio, setBio] = useState(base.bio ?? "");

  const valid = nickname.trim().length >= 2 && neighborhood.trim().length > 0;
  const editing = Boolean(initial);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    const saved = saveProfile({
      ...base,
      address,
      nickname: nickname.trim(),
      neighborhood,
      avatarEmoji,
      bio: bio.trim(),
    });
    onSaved(saved);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <span className="mb-1.5 block text-sm font-semibold">프로필 사진</span>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatarEmoji(a)}
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border text-2xl transition ${
                avatarEmoji === a
                  ? "border-transparent bg-brand-gradient shadow-glow"
                  : "border-[var(--line)] bg-white hover:bg-brand-50"
              }`}
              aria-label={`아바타 ${a}`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">닉네임</span>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="예) 코인부자"
          maxLength={20}
          className="dd-input"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">
          우리 동네 <span className="text-ink-muted">(동네 인증)</span>
        </span>
        <select
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          className="dd-input"
        >
          {NEIGHBORHOOD_LABELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <span className="mt-1.5 block text-xs text-ink-muted">
          동네를 인증해야 이웃과 채팅할 수 있어요.
        </span>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">한 줄 소개</span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={120}
          placeholder="이웃에게 나를 소개해 주세요."
          className="dd-input resize-none"
        />
      </label>

      <div className="flex gap-3">
        <button type="submit" disabled={!valid} className="btn-primary flex-1 !py-3.5">
          {editing ? "프로필 저장" : "계정 만들기"}
        </button>
        {editing && onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost !py-3.5">
            취소
          </button>
        )}
      </div>
    </form>
  );
}
