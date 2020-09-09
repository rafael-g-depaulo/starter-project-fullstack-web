import express, { Router as ExpressRouter, RouterOptions } from "express"
import { Connection } from "typeorm"

import UserRouter from "./User"

export interface RouterDeps {
  conn: Connection
}

export interface Router<Deps extends BaseRouterDeps> {
  (deps: Deps, options?: RouterOptions): ExpressRouter
}

const defaultOptions: RouterOptions = {
  mergeParams: true
}

type BaseRouterDeps = {
  conn: Connection
}

const Routes: Router<BaseRouterDeps> = ({ conn }, options = defaultOptions) => express.Router(options)
  .get("/ping", (_, res) => res.json("pong"))
  .use("/user", UserRouter({ conn }, options))

export default Routes
