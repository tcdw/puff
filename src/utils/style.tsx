/**
 * 为单一元素生成符合 BEM 规则的 CSS Class 名称
 * @param block
 * @param element
 * @param modifiers
 * @returns classes 返回的 Class 名称
 */
export function bem(
    block: string,
    element?: string | null,
    modifiers: Record<string, any> = {},
) {
    let baseName = block;
    if (element) {
        baseName += `__${element}`;
    }

    const classes = [baseName];
    Object.entries(modifiers).forEach(([k, v]) => {
        if (v) {
            classes.push(`${baseName}--${k}`);
        }
    });
    return classes.join(" ");
}
