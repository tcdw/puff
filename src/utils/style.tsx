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

/**
 * CSS 距离测量缓存
 */
const measureMap = new Map<string, number>();

/**
 * CSS 距离测量
 * @param cssSize CSS 距离值
 * @param disableCache 不要从缓存读取距离值（适用于会动态变化的 CSS 变量）
 * @return pixelSize 像素距离值
 */
export function measureSize(cssSize: string, disableCache = false) {
    if (!disableCache) {
        const got = measureMap.get(cssSize);
        if (got) {
            return got;
        }
    }
    const el = document.createElement("div");
    el.style.position = "absolute";
    el.style.height = cssSize;
    el.style.top = `calc(0px - ${cssSize})`;
    document.body.appendChild(el);
    const { height } = el.getBoundingClientRect();
    if (!disableCache) {
        measureMap.set(cssSize, height);
    }
    el.remove();
    return height;
}
