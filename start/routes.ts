/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const UserController = () => import('#controllers/user_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('users', [UserController, 'index']);
router.post('signup', [UserController, 'signUp']);
router.post('signin', [UserController, 'signIn']);
