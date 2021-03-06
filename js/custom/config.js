
/** global configuration variable **/

var config = {

    //host configuration
    "hostname":"localhost",
    "port":"8080",
    "rootPath":"scrumble-server-web/scrumble",

    //here are listed all available resources for Rest Webservices. Don't forget to update it each time a new resource is created
    "resources": {
            "members":"members",
            "projects":"projects",
            "projectMembers":"members",
            "userStories":"userstories",
            "tasks":"tasks",
            "sprints":"sprints",
            "roles":"roles",
            "authentication":"auth"
        },

    "processStatus" : {
            "proposed" : "pro",
            "accepted" : "acc",
            "estimated" : "est",
            "toDo" : "tod",
            "inProgress" : "inp",
            "done" : "don"
        },
        
    "cookie" : {
        "name" : "com.scrumble.client.cookie",
        "url" : "login.html"
        }
};

var leftMenu= {
            "projectDashboard.html" : "left-menu-option-project",
            "project.html" : "left-menu-option-project",
            "sprintList.html" : "left-menu-option-sprint",
            "sprint.html" : "left-menu-option-sprint",
            "sprintBoard.html" : "left-menu-option-sprint",
            "sprintBurndownChart.html" : "left-menu-option-sprint",
            "sprintStoryManagement.html" : "left-menu-option-sprint",
            "storyList.html" : "left-menu-option-story",
            "story.html" : "left-menu-option-story",
            "projectMember.html" : "left-menu-option-member",
            "dashboard.html" : "left-menu-option-dashboard",
            "projectList.html" : "left-menu-option-project",
            "modules.html" : "left-menu-option-module",
            "memberList.html" : "left-menu-option-member",
            "member.html" : "left-menu-option-member"
            };
