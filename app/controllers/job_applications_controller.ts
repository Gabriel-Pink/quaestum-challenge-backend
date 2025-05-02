import type { HttpContext } from '@adonisjs/core/http';
import JobApplication from '#models/job_application';
import UserService from '#services/user_service';

export default class JobApplicationsController {

    async index({ request, response }: HttpContext) {
        
        const data = request.only([
            'name',
            'birthDate',
            'email',
            'phone',
            'address',
            'zipCode',
            'educations',
            'skills',
        ]);

        if(await UserService.getUserByEmail(data.email)) {
            return response.badRequest({ message: 'E-mail already in use' });
        }
        

        const user = await UserService.signUp({
            email: data.email.trim().toLowerCase(),
            password: '12345678@#@!4cD',
            fullName: data.name,
            role: 'candidate'
        });

        if (!user.success) {
            return response.badRequest({ message: user.error });
        }

        
        const application = await JobApplication.create({
            ...data, 
            userId: user.user.id,
            skills: JSON.stringify(data.skills),
            educations: JSON.stringify(data.educations),
            status: 'pending'
        });

        return response.ok(application);
    }

}