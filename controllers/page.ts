import { RequestHandler } from "express";

const renderHome: RequestHandler = (req, res, next) => {
  res.render("home");
};

export { renderHome };