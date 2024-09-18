import { type } from "os";

export default function (plop) {
  /* welcome message that will display in CLI */
  plop.setWelcomeMessage(
    "Welcome to plop! What type of file would you like to generate?"
  );

  plop.setHelper("actualName", function (fullNameWithPath) {
    return fullNameWithPath.data.root.name.split("/").pop();
  });
  plop.setHelper("camelCaseActualName", function (fullNameWithPath) {
    const name = fullNameWithPath.data.root.name.split("/").pop();
    return name.charAt(0).toLowerCase() + name.slice(1);
  });

  plop.setGenerator("controller", {
    description: "create a new controller",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "controller name (example: Auth):",
      },
    ],
    actions: (data) => {
      const folderName = data.name[0].toUpperCase() + data.name.slice(1);
      const fileName = folderName + "Controller";
      console.log(
        `Creating controller file at: src/app/http/controllers/api/${folderName}/${fileName}.ts`
      );
      const actions = [
        {
          type: "add",
          path: `src/app/http/controllers/api/${folderName}/${fileName}.ts`,
          templateFile: "cli-templates/controller.hbs",
        },
      ];
      return actions;
    },
  });

  plop.setGenerator("service", {
    description: "Create a new service file",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Service file name:",
      },
    ],
    actions: (answers) => {
      const capitalize = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
      };
      const capitalized = capitalize(answers.name);
      return [
        {
          type: "add",
          path: `src/app/services/${capitalized}Service.ts`,
          templateFile: "cli-templates/service.hbs",
          data: {
            capitalizedName: capitalized,
          },
        },
      ];
    },
  });

  plop.setGenerator("request", {
    description: "create request validation class",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "request class name:",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/app/http/requests/{{name}}.ts",
        templateFile: "cli-templates/request.hbs",
      },
    ],
  });

  plop.setGenerator("response", {
    description: "create response file",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "response file name:",
      },
      {
        type: "input",
        name: "Model",
        message: "mode name:",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/app/http/responses/{{name}}.ts",
        templateFile: "cli-templates/response.hbs",
      },
    ],
  });

  plop.setGenerator("route", {
    description: "create route file",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "route name (e.g., 'admin'):",
      },
      {
        type: "list",
        name: "requiresAuth",
        message: "requires auth (yes/no):",
        choices: ["yes", "no"],
      },
    ],
    actions: function (data) {
      const routePath = `src/routes/api/${data.name}.ts`;

      console.log(`Creating route file at: ${routePath}`);

      // Actions to create the route file and ensure parent file is available
      const actions = [
        // Create the new route file
        {
          type: "add",
          path: routePath,
          templateFile: "cli-templates/route.hbs",
        },
        // Create the parent directory if it does not exist
        {
          type: "add",
          path: `src/routes/`,
          template: "",
          skipIfExists: true,
        },
      ];

      // Modify the parent file based on auth requirement
      if (data.requiresAuth === "yes") {
        console.log("Adding auth middleware to route file...");
        actions.push({
          type: "modify",
          path: routePath,
          skipIfNotExists: true,
          transform: (match, ctx) => {
            // Replace the specific router.get line with the new format
            const replacedRouterLine = match.replace(
              /router\.(get|post|put|delete|patch)\("\/?(.*?)", (\w+Controller\.\w+)\);/g,
              `router.$1('/$2', verifyToken, $3);`
            );
            // Replace the import statement if necessary
            const replacedImportStatement = replacedRouterLine.replace(
              'import { Router } from "express";',
              'import { Router } from "express";\nimport { verifyToken } from "../../app/http/middleware/Auth";'
            );

            return replacedImportStatement;
          },
        });
      } else {
        actions.push({
          type: "modify",
          path: routePath,
          pattern: /(\/\/ROUTERS USE ADD HERE)/g,
          template:
            "router.use('/{{actualName}}', {{actualName}}Controller);\n$1",
          skipIfNotExists: true,
        });
      }

      return actions;
    },
  });

  plop.setGenerator("job", {
    description: "create background job file",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "job name:",
      },
    ],
    actions: function (data) {
      const toImportIntoFile = data.name.split("/")[0];
      const actions = [
        {
          type: "add",
          path: "src/app/jobs/{{name}}.ts",
          templateFile: "cli-templates/jobs.hbs",
        },
        {
          type: "modify",
          path: `src/app/providers/queues.ts`,
          pattern: /(\/\/IMPORT QUEUES HERE)/g,
          template:
            "import  { {{actualName}}Queue }  from '../jobs/{{actualName}}';\n$1",
        },
        {
          type: "modify",
          path: `src/app/providers/queues.ts`,
          pattern: /(\/\/ADD ADAPTERS HERE)/g,
          template: " new BullMQAdapter({{actualName}}Queue), \n$1",
        },
      ];

      return actions;
    },
  });

  plop.setGenerator("mail", {
    description: "create an email template",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "template name:",
      },
    ],
    actions: function (data) {
      const actions = [
        {
          type: "add",
          path: "src/app/mails/{{name}}.ts",
          templateFile: "cli-templates/mail.hbs",
        },
        {
          type: "add",
          path: "src/views/email/{{camelCaseActualName}}.hbs",
          templateFile: "cli-templates/mail_view.hbs",
        },
      ];

      return actions;
    },
  });
}
