import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), ...prefix("day", [route(":id", "routes/day/id.tsx")])] satisfies RouteConfig;
