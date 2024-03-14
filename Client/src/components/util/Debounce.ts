export function debounce(func: Function, wait: number): Function {
    let timeout: ReturnType<typeof setTimeout>;

    return function executedFunction(...args: any[]): void {
        const later = (): void => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
