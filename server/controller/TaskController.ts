import { TaskRepository } from "../repositories/TaskRepository";
import { Request, Response } from "express";
import { Prisma, PrismaClient, User } from "@prisma/client";

export class TaskController {
  private taskRepo: TaskRepository;
  private prisma: PrismaClient;
  constructor() {
    this.taskRepo = new TaskRepository()
    this.prisma = new PrismaClient()
    console.log(`TASK CONTROLLER : ${typeof this.taskRepo}`)
  }
  async getAssignedTasks(employee_id: number) {
    return await this.taskRepo.getAssignedTasks(employee_id)
  }
  async createTask(req: Request, res: Response) {
    // console.log(`DATA : ${{...req.body}}`)
    console.log(`DATA : ${JSON.stringify(req.body)}`)
    // const id = await this.prisma.task.findFirst({
    //     select:{
    //         id : true
    //     }
    // })
    // console.log(`ID GOT : ${JSON.stringify(id)}`)
    //
    // const data = await this.prisma.task.create({
    //     data: {
    //         //
    //         // name: req.body.name,
    //         // description : req.body.description,
    //         // status_id: req.body.status_id,
    //         // project_id: req.body.project_id,
    //         // employee_id: req.body.employee_id,
    //         // assigned_to: req.body.assigned_to
    //         ...req.body
    //     }
    // });
    // console.log(`DATA CREATED : ${JSON.stringify(data)}`)
    // console.log()
    try {
      console.log(`INSIDE TRY - 24`)
      res.status(201).json(await this.prisma.task.create({
        data: {
          ...req.body
          // name : "Task-NEW",
          // status_id: 1,
          // project_id: 1,
          // employee_id: 1,
          // assigned_to: 1,
          // description: "desc"
        }
      }))
    } catch (err) {
      console.log(`INSIDE CATCH - 39`)
      // @ts-ignore
      const e = err.toString()
      // console.log(`TYPEOF - ${typeof err}`)
      console.log(`TYPEOF - ${e}`)
      // console.log(`TYPEOF - ${JSON.stringify()}`)
      // throw err
      if (err instanceof Prisma.PrismaClientValidationError) {
        // @ts-ignore
        console.log(`CATCH _ VALIDATION ERROR 42 ${err.errorCode}`)
        console.log(`CATCH _ VALIDATION ERROR 42 ${err.message}`)
        // throw err
        res.status(400).json({ "message": "Bad Request", "error": "Missing fields" })
        // return {"status": 400, "message": "Bad Request", "error": "Missing fields"}
      }

    }
  }
  async getAllTasks(req: Request, res: Response) {
    try {
      return await this.prisma.task.findMany({
        select: {
          name: true,
          description: true,
          status: {
            select: {
              name: true
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        // @ts-ignore
        console.log(`CATCH _ VALIDATION ERROR 42 ${error.errorCode}`)
        console.log(`CATCH _ VALIDATION ERROR 42 ${error.message}`)
        // throw err
        res.status(400).json({ "message": "Bad Request", "error": error.message })
      }
    }
    //     try {
    //         console.log(`CALLING repo`)
    //         const tss_repo = await this.taskRepo.createTask(req.body)
    //         // console.log(`CALLED repo ${JSON.stringify(tss_repo?.status)}`)
    //     } catch (err) {
    //         console.log(`ERR TSController: ${err}`)
    //         res.sendStatus(400)
    //     }
    //     res.sendStatus(201)
  }

  async getTaskDetail(task_id: number) {
    const data = await this.prisma.task.findFirst({
      where: {
        id: {
          equals: task_id
        }
      }
    })
    console.log(`TaskController - 25 : ${JSON.stringify(data)}`)
    return data
  }
}