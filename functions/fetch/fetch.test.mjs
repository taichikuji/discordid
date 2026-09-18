import { test, expect } from "bun:test";
import { config } from "./fetch.mjs";

test("exports a rateLimit config (declarative, platform-enforced)", () => {
  expect(config).toBeDefined();
  expect(config.rateLimit).toBeDefined();
});

test("rate limit path matches this function's route", () => {
  expect(config.path).toBe("/.netlify/functions/fetch");
});

test("rate limit window is 20 requests per 60 seconds", () => {
  expect(config.rateLimit.windowLimit).toBe(20);
  expect(config.rateLimit.windowSize).toBe(60);
});

test("rate limit is aggregated by client IP only", () => {
  expect(config.rateLimit.aggregateBy).toEqual(["ip"]);
});
