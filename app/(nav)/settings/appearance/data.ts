export const transformData = (data: any) => {
    return {
        theme: data.appearance.theme,
        view: data.appearance.card,
        navbar: data.appearance.navbar,
        mode: data.appearance.colorMode,
        font: data.appearance.fonts,
        color: data.appearance.dashboardColor,
        zoom: data.appearance.zoom,
    };
}