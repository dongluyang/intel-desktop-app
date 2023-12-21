export async function getTeamApiUrl() {
    const teamConfig = await window.intel_configs.get("current_team_setting")
    if (teamConfig!=null) {
      const existedTeamInfoConfig = JSON.parse(teamConfig)
      return existedTeamInfoConfig.apiUrl + '/cgteam/cgteam';
    }
	return '';
}

export async function getUserInfo() {
    const defaultConfig = await window.intel_configs.get("user_info")
    if (defaultConfig!=null) {
      const existedUserInfoConfig = JSON.parse(defaultConfig)
      return {'userName':existedUserInfoConfig.userName,'accessToken':existedUserInfoConfig.accessToken}
    }
    return {}
}

