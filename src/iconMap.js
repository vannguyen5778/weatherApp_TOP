export const ICON_MAP = new Map();

addMapping([0, 1], "clear");
addMapping([2, 3, 45, 48], "clouds");
addMapping([51, 53, 55], "drizzle");
addMapping([56, 57], "mist");
addMapping([61, 63, 65, 80, 81, 82, 95, 96, 99], "rain");
addMapping([71, 73, 75, 77, 85, 86], "snow");

function addMapping(values, icon) {
    values.forEach(value=> {
        ICON_MAP.set(value, icon);
    });
}

export const AIR_QUALITY_MAP = new Map();
AIR_QUALITY_MAP.set(1, "Good");
AIR_QUALITY_MAP.set(2, "Fair");
AIR_QUALITY_MAP.set(3, "Moderate");
AIR_QUALITY_MAP.set(4, "Poor");
AIR_QUALITY_MAP.set(5, "Very Poor");