import { notFound } from "next/navigation";
import { getProduct, PRODUCTS } from "@/lib/products";
import { ChatRoom } from "@/components/ChatRoom";

// 정적 export: 시드 상품 id 마다 채팅방을 미리 생성 (products/[id] 와 동일 패턴)
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) notFound();
  return <ChatRoom product={product} />;
}
