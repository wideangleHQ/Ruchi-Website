export function ArticleContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-lg max-w-none
        prose-headings:font-serif prose-headings:text-text prose-headings:font-bold
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-[15px] prose-p:leading-[1.85] prose-p:text-text/85 prose-p:mb-5
        prose-a:text-primary-green prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-deep-green
        prose-strong:text-text prose-strong:font-semibold
        prose-blockquote:border-l-4 prose-blockquote:border-primary-green/30 prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-muted-text
        prose-img:rounded-[var(--radius-brand)] prose-img:my-8
        prose-ul:pl-6 prose-ol:pl-6
        prose-li:text-[15px] prose-li:leading-[1.8] prose-li:text-text/85
        prose-hr:border-border prose-hr:my-10
        prose-table:text-sm prose-th:text-left prose-th:font-semibold prose-th:text-text prose-td:text-text/85
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
