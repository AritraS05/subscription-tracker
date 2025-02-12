import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: [true,"User name is required :)"],
        trim : true,
        minLength: 2,
        maxLength: 100,
    },
    price:{
        type: Number, 
        required: [true,"Price is required :)"],
        min: [0,"Price must be greater than 0"],
    },
    currency:{
        type: String,
        enum:{'USD':1,'INR':2,'EUR':3},
        default:'INR',
    },
    frequency:{
        type: String,
        enum:{'weekly':1, 'monthly':2, 'yearly':3},
        default:'monthly',
    },
    category:{
        type:String,
        enum:{'sports':1,'news':2,'entertainment':3,'lifestyle':4,'business':5},
        default:'entertainment',
        required:true,
    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type:String,
        enum:{'active':1,'canceled':2,'expired':3},
    },
    startDate:{
        type:Date,
        required:true,
        validate:{
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past',
        },
    },
    renewalDate:{
        type:Date,
        // required:true, -->making this change for the auto-calculate function i am bored asf ngl
        validate:{
            validator: function(value){
                return value >  this.startDate;
            },
            message: 'renewal date must be in the future',
        },
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true,
    },
},{timestamps: true});

//todo: need to write a function to auto-calculate if the renewal date is missing 
subscriptionSchema.pre('save',function(next){
  if(!this.renewalDate){
    const renewalPeriods = {
        'weekly':7,
        'monthly':30,
        'yearly':365,
    };
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
  }   

  //todo: auto updation of status if renewal date has passed
  if(this.renewalDate < new Date()){
    this.status = 'expired';
  }
  next();
});

const Subscription = mongoose.model('Subscription',subscriptionSchema);

export default Subscription;