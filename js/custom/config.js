
/** global configuration variable **/

var config = {

	//host configuration
	"hostname":"192.168.10.12",
	"port":"8082",
	"rootPath":"scrumble-server-web/scrumble",

	//here are listed all available resources for Rest Webservices. Don't forget to update it each time a new resource is created
	"resources": {
			"members":"members",
			"projects":"projects",
			"projectMembers":"members",
			"userStories":"userstories",
			"tasks":"tasks",
			"sprints":"sprints"
		}


};
