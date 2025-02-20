require("dotenv").config();

// Export the testConfig object
const testConfig = {
    users: [
        {
            role: "arem",
            aut_arem_uid: process.env.aut_arem_uid,
            aut_arem_pwd: process.env.aut_arem_pwd
        }, 
        {
            role: "assrem",
            aut_assrem_uid: process.env.aut_assrem_uid,
            aut_assrem_pwd: process.env.aut_assrem_pwd
        },
        {
            role: "rem",
            aut_rem_uid: process.env.aut_rem_uid,
            aut_rem_pwd: process.env.aut_rem_pwd
        },
        {
            role: "srem",
            aut_srem_uid: process.env.aut_srem_uid,
            aut_srem_pwd: process.env.aut_srem_pwd
        },
        {
            role: "gm",
            aut_gm_uid: process.env.aut_gm_uid,
            aut_gm_pwd: process.env.aut_gm_pwd
        },
        {
            role: "ass_dir",
            aut_assdir_uid: process.env.aut_assdir_uid,
            aut_assdir_pwd: process.env.aut_assdir_pwd
        },
        {
            role: "dir",
            aut_dir_uid: process.env.aut_dir_uid,
            aut_dir_pwd: process.env.aut_dir_pwd
        },
        {
            role: "m_dir",
            aut_mdir_uid: process.env.aut_mdir_uid,
            aut_mdir_pwd: process.env.aut_mdir_pwd
        },
        {
            role: "admin",
            aut_admin_uid: process.env.aut_admin_uid,
            aut_admin_pwd: process.env.aut_admin_pwd
        },
        {
            role: "RESC",
            resc_Username: process.env.RESC_USER_NAME,
            resc_Password: process.env.RESC_PASSWORD
        }
    ]
};
//Export the testconfig Object
module.exports={testconfig}