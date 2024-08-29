/**
 * Function to format text containing HYPERLINK toekn into React node.
 * normalText: A string that may contain token like HYPERLINK[text](url) to
 * be converted into clickable links
 *
 * e.g. normalText = "There is new formatting like so: HYPERLINK[the startup Cydoc](https://www.cydoc.ai)"
 * parts = ["There is new formatting like so:", "the startup Cydoc", "https://www.cydoc.ai"]
 *
 * Conditions:
 * i % 3 === 1 : identify parts of array that contains the hyperlink text.
 * i % 3 === 2 : identify parts of containing the url.
 * otherwise, normalText to be wrapped in `<span>`
 */
export function HandleHyperlinkFormatter(
    normalText: string
): React.ReactNode[] {
    // 1. Split to match HYPERLINK[text](url) format
    const hyperlinkRegex = /HYPERLINK\[(.+?)\]\((.+?)\)/g;
    const parts = normalText.split(hyperlinkRegex);

    // 2. Process each parts
    const nodes: React.ReactNode[] = [];
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i % 3 === 1) {
            // Text of the hyperlink
            const linkText = part.trim() || parts[i + 1]; // use URL as text if text is empty
            nodes.push(
                <a
                    key={`link-text-${i}`}
                    href={formatUrl(parts[i + 1])}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                        color: '#037a9b',
                        textDecoration: 'underline',
                    }}
                >
                    {linkText}
                </a>
            );
        } else if (i % 3 === 2) {
            // URL of the hyperlink
            continue;
        } else {
            // Normal text
            nodes.push(<span key={`text-${i}`}>{part}</span>);
        }
    }

    return nodes;
}

/**
 * A Helper Function to ensure the URL has a proper scheme (http or https).
 */
function formatUrl(url: string): string {
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
}

export default HandleHyperlinkFormatter;
