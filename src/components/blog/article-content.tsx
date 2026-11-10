export function ArticleContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-lg max-w-none
        prose-headings:font-serif prose-headings:text-gray-950 prose-headings:font-bold
        prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:font-bold
        prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:font-bold
        prose-p:text-[16px] prose-p:leading-[1.85] prose-p:text-gray-900 prose-p:mb-5 prose-p:font-semibold
        prose-a:text-[#168a4a] prose-a:font-bold prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-[#0e6337]
        prose-strong:text-black prose-strong:font-bold
        prose-blockquote:border-l-4 prose-blockquote:border-[#168a4a]/40 prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-gray-800 prose-blockquote:font-semibold
        prose-img:rounded-[var(--radius-brand)] prose-img:my-8
        prose-ul:pl-6 prose-ol:pl-6
        prose-li:text-[16px] prose-li:leading-[1.8] prose-li:text-gray-900 prose-li:font-semibold
        prose-hr:border-gray-200 prose-hr:my-10
        prose-table:text-sm prose-th:text-left prose-th:font-bold prose-th:text-black prose-td:text-gray-900 prose-td:font-semibold
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
