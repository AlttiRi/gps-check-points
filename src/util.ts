export function renderTemplateString(template: string, props: Record<string, any>) {
    let hasUndefined = false;
    const value = template.replaceAll(/{[^{}]+?}/g, (match, _index, _string) => {
        const key = match.slice(1, -1);
        const value = props[key];
        if (value === undefined) {
            console.warn(`[renderTemplateString] ${match} is undefined`);
            hasUndefined = true;
        }
        return value;
    });
    return {hasUndefined, value};
}
