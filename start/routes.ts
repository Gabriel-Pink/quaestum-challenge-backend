/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import JobApplicationsController from '#controllers/job_applications_controller';
import { middleware } from './kernel.js';
const UserController = () => import('#controllers/user_controller')



router.post('signup', [UserController, 'signUp']);
router.post('signin', [UserController, 'signIn']);

router.post('job-application', [JobApplicationsController, 'index']);

router.get('/', async ({ auth }) => {
  return auth.use('jwt').getUserOrFail()
})
.use(middleware.auth({ guards: ['jwt'] }))


