import dayjs from 'dayjs';
import {createRequire } from 'module';
import Subscription from '../models/subscription.model';
import { subscribe } from 'diagnostics_channel';
const require = createRequire(import.meta.url);
const {serve} = require('@upstash/workflow/express')

const REMINDERS = [7,5,2,1];

export const sendReminders = serve(async(context) =>{
    const {subscriptionId} = context.requestPayload;
    const Subscription = await fetchSubscription(context,subscriptionId);

    if(!Subscription || subscription.status !== 'active') {
        return;
    }

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())){
        console.log(`Renewal has passed for subscription ${subscription.id}`);
        console.log('stopping workflow');
        return;
    }

    for(const daysBefore of REMINDERS){
        const reminderDate = renewalDate.subtract(daysBefore,'day');

        if(reminderDate.isAfter(dayjs())){
            console.log(`Reminder date has passed for subscription ${subscription.id}`);
            console.log('stopping workflow');
            return;
        }
    }
}
);

const fetchSubscription = async(context,subscriptionId) =>{
    return await context.run('get subscription',() =>{
        return Subscription.findById(subscriptionId).populate('user','name email');
    })
}