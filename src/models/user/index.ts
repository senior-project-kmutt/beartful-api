export interface IUsers {
    _id: string;
    email: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    profileImage: string;
    role: string;
    phoneNumber: string;
}

export interface IUserLogin {
    username: string;
    password: string;
}

export interface IUserFreelance extends IUsers {
    recipientId: string;
    dateOfBirth: Date;
    address: string;
    education: Array<IUserEducation[]>;
    experience?: Array<IUserExperience[]>;
    skill?: Array<IUserSkillAndLanguage[]>;
    language?: Array<IUserSkillAndLanguage[]>;
    award?: Array<IUserAward[]>;
    bankAccount: IUserBankAccount;
}

export interface IUserEducation {
    degree: string;
    institution: string;
    major: string
}

export interface IUserExperience {
    companyName: string;
    position: string;
    isCurrentJob: string;
    monthStartJob: string;
    yearStartJob: string;
    monthEndJob?: string;
    yearEndJob?: string
}

export interface IUserSkillAndLanguage {
    type: string;
    title: string;
    level: string;
}

export interface IUserAward {
    title: string;
    description: string;
}

export interface IUserBankAccount {
    bankName: string;
    bankAccountNumber: string;
    bankAccountImage: string;
    bankAccountName: string;
}

import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    education: {
        type: Array<IUserEducation>,
        required: false
    },
    experience: {
        type: Array<IUserExperience>,
        required: false
    },
    skill: {
        type: Array<IUserSkillAndLanguage>,
        required: false
    },
    language: {
        type: Array<IUserSkillAndLanguage>,
        required: false
    },
    award: {
        type: Array<IUserAward>,
        required: false
    },
    bankAccount: {
        type: Object,
        required: false
    },
    recipientId: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
})

export const Users = mongoose.model('Users', userSchema)