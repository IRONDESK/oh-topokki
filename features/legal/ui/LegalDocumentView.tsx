import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/shared/lib/cn";
import { LegalBlock, LegalDocument } from "@/features/legal/model/types";

type Props = {
  // 최신 버전이 맨 앞
  versions: LegalDocument[];
  // 개정 이력(버전·개정일) 표시 및 이전 버전 열람
  showHistory?: boolean;
};

const formatDate = (date: string) => format(date, "yyyy년 M월 d일");

const TABLE_CLS =
  "w-full min-w-max border-collapse text-xs [&_th]:bg-gray-50 [&_th]:font-semibold [&_th]:text-gray-600 [&_th,&_td]:border [&_th,&_td]:border-gray-200 [&_th,&_td]:px-2 [&_th,&_td]:py-1.5 [&_th,&_td]:text-left [&_th,&_td]:align-top [&_td]:whitespace-pre-line [&_td]:max-w-[260px]";

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") return <p>{block}</p>;

  if ("list" in block) {
    return (
      <ol className="list-decimal [&>li]:list-decimal pl-5 flex flex-col gap-1">
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    );
  }

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className={TABLE_CLS}>
        <thead>
          <tr>
            {block.table.head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 약관/방침 문서 한 편을 렌더한다. showHistory면 하단에 개정 이력과 이전 버전 열람을 제공. */
export default function LegalDocumentView({ versions, showHistory }: Props) {
  const [selected, setSelected] = useState(versions[0].version);
  const doc = versions.find((v) => v.version === selected) ?? versions[0];
  const isLatest = doc === versions[0];

  return (
    <article className="flex flex-col gap-5 text-sm leading-relaxed text-gray-700 break-keep">
      <p className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-gray-500">
        <span className="rounded-md bg-primary-50 border border-primary-200 px-1.5 py-0.5 text-primary-700">
          v{doc.version}
        </span>
        시행일 {formatDate(doc.effectiveDate)}
        {!isLatest && (
          <button
            type="button"
            onClick={() => setSelected(versions[0].version)}
            className="cursor-pointer underline text-primary-600"
          >
            최신 버전 보기
          </button>
        )}
      </p>

      {doc.preface && <p>{doc.preface}</p>}

      {doc.sections.map((section) => (
        <section key={section.title} className="flex flex-col gap-2">
          <h4 className="text-base font-semibold text-gray-800">
            {section.title}
          </h4>
          {section.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </section>
      ))}

      {showHistory && (
        <section className="flex flex-col gap-2 pt-4 border-t border-gray-200">
          <h4 className="text-base font-semibold text-gray-800">개정 이력</h4>
          <table className={TABLE_CLS}>
            <thead>
              <tr>
                <th>버전</th>
                <th>개정일(시행일)</th>
                <th>주요 내용</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v) => (
                <tr
                  key={v.version}
                  data-selected={v.version === doc.version}
                  className="data-[selected=true]:bg-primary-50"
                >
                  <td>
                    <button
                      type="button"
                      onClick={() => setSelected(v.version)}
                      className={cn(
                        "cursor-pointer font-medium",
                        v.version === doc.version
                          ? "text-primary-700"
                          : "underline text-gray-600",
                      )}
                    >
                      v{v.version}
                    </button>
                  </td>
                  <td>{formatDate(v.effectiveDate)}</td>
                  <td>{v.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </article>
  );
}
