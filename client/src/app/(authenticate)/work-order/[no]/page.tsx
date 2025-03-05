import type { PageProps } from "@/interfaces/global";
import Detail from "@/modules/detail";
import { getWoDetail } from "@/modules/detail/action";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function Page({ params }: PageProps) {
  const { no } = await params;
  const data = await getWoDetail(no);
  if (!data) notFound();

  return <Detail data={data} />;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export const revalidate = 259200000; //3 hari

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { no } = await params;
  const data = await getWoDetail(no);

  return {
    title: data ? `${data.no} | ${data.name}` : "Not Found",
    authors: data
      ? [{ name: data.creator_name }, { name: data.operator_name }]
      : [],
    keywords: data
      ? [data.status, data.creator_name, data.operator_name, data.name]
      : [],
  };
}
