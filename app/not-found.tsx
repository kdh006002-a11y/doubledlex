import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <div className="text-6xl">🥕</div>
      <h1 className="mt-4 text-2xl font-extrabold">페이지를 찾을 수 없어요</h1>
      <p className="mt-2 text-ink-muted">
        주소가 바뀌었거나 사라진 상품일 수 있어요.
      </p>
      <Link href="/" className="btn-primary mt-6">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
