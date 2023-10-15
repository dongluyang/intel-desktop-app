<template>
<!-- 更新.模态框 -->
<div class="modal fade" id="updateModal" tabindex="-1" role="dialog"  aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
            	<h4 class="modal-title" >${I18n.jobinfo_field_update}</h4>
         	</div>
         	<div class="modal-body">
				<form class="form-horizontal form" role="form" >

                    <p style="margin: 0 0 10px;text-align: left;border-bottom: 1px solid #e5e5e5;color: gray;">${I18n.jobinfo_conf_base}</p>    <#-- 基础信息 -->
                    <div class="form-group">
                        <label for="firstname" class="col-sm-2 control-label">${I18n.jobinfo_field_jobgroup}<font color="red">*</font></label>
                        <div class="col-sm-4">
                            <select class="form-control" name="jobGroup" >
                                <#list JobGroupList as group>
                                    <option value="${group.id}" >${group.title}</option>
                                </#list>
                            </select>
                        </div>

                        <label for="lastname" class="col-sm-2 control-label">${I18n.jobinfo_field_jobdesc}<font color="red">*</font></label>
                        <div class="col-sm-4"><input type="text" class="form-control" name="jobDesc" placeholder="${I18n.system_please_input}${I18n.jobinfo_field_jobdesc}" maxlength="50" ></div>
                    </div>
                    <div class="form-group">
                        <label for="lastname" class="col-sm-2 control-label">${I18n.jobinfo_field_author}<font color="red">*</font></label>
                        <div class="col-sm-4"><input type="text" class="form-control" name="author" placeholder="${I18n.system_please_input}${I18n.jobinfo_field_author}" maxlength="50" ></div>
                        <label for="lastname" class="col-sm-2 control-label">${I18n.jobinfo_field_alarmemail}<font color="black">*</font></label>
                        <div class="col-sm-4"><input type="text" class="form-control" name="alarmEmail" placeholder="${I18n.jobinfo_field_alarmemail_placeholder}" maxlength="100" ></div>
                    </div>

                    <br>
                    <p style="margin: 0 0 10px;text-align: left;border-bottom: 1px solid #e5e5e5;color: gray;">${I18n.jobinfo_conf_schedule}</p>    <#-- 调度配置 -->
                    <div class="form-group">
                        <label for="firstname" class="col-sm-2 control-label">${I18n.schedule_type}<font color="red">*</font></label>
                        <div class="col-sm-4">
                            <select class="form-control scheduleType" name="scheduleType" >
                                <#list ScheduleTypeEnum as item>
                                    <option value="${item}" >${item.title}</option>
                                </#list>
                            </select>
                        </div>

                        <input type="hidden" name="scheduleConf" />
                        <div class="schedule_conf schedule_conf_NONE" style="display: none" >
                        </div>
                        <div class="schedule_conf schedule_conf_CRON" >
                            <label for="lastname" class="col-sm-2 control-label">Cron<font color="red">*</font></label>
                            <div class="col-sm-4"><input type="text" class="form-control" name="schedule_conf_CRON" placeholder="${I18n.system_please_input}Cron" maxlength="128" ></div>
                        </div>
                        <div class="schedule_conf schedule_conf_FIX_RATE" style="display: none" >
                            <label for="lastname" class="col-sm-2 control-label">${I18n.schedule_type_fix_rate}<font color="red">*</font></label>
                            <div class="col-sm-4"><input type="text" class="form-control" name="schedule_conf_FIX_RATE" placeholder="${I18n.system_please_input} （ Second ）" maxlength="10" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" ></div>
                        </div>
                        <div class="schedule_conf schedule_conf_FIX_DELAY" style="display: none" >
                            <label for="lastname" class="col-sm-2 control-label">${I18n.schedule_type_fix_delay}<font color="red">*</font></label>
                            <div class="col-sm-4"><input type="text" class="form-control" name="schedule_conf_FIX_DELAY" placeholder="${I18n.system_please_input} （ Second ）" maxlength="10" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" ></div>
                        </div>
                    </div>

                    <br>
                    <p style="margin: 0 0 10px;text-align: left;border-bottom: 1px solid #e5e5e5;color: gray;">${I18n.jobinfo_conf_job}</p>    <#-- 任务配置 -->

                    <div class="form-group">
                        <label for="firstname" class="col-sm-2 control-label">${I18n.jobinfo_field_gluetype}<font color="red">*</font></label>
                        <div class="col-sm-4">
                            <select class="form-control glueType" name="glueType" disabled >
                                <#list GlueTypeEnum as item>
                                    <option value="${item}" >${item.desc}</option>
                                </#list>
                            </select>
                        </div>
                        <label for="firstname" class="col-sm-2 control-label">JobHandler<font color="red">*</font></label>
                        <div class="col-sm-4"><input type="text" class="form-control" name="executorHandler" placeholder="${I18n.system_please_input}JobHandler" maxlength="100" ></div>
                    </div>

                    <div class="form-group">
                        <label for="firstname" class="col-sm-2 control-label">${I18n.jobinfo_field_executorparam}<font color="black">*</font></label>
                        <div class="col-sm-10">
                            <textarea class="textarea form-control" name="executorParam" placeholder="${I18n.system_please_input}${I18n.jobinfo_field_executorparam}" maxlength="512" style="height: 63px; line-height: 1.2;"></textarea>
                        </div>
                    </div>

                    <br>
                    <p style="margin: 0 0 10px;text-align: left;border-bottom: 1px solid #e5e5e5;color: gray;">${I18n.jobinfo_conf_advanced}</p>    <#-- 高级配置 -->

                    <div class="form-group">
                        <label for="firstname" class="col-sm-2 control-label">${I18n.jobinfo_field_executorRouteStrategy}<font color="red">*</font></label>
                        <div class="col-sm-4">
                            <select class="form-control" name="executorRouteStrategy" >
                                <#list ExecutorRouteStrategyEnum as item>
                                    <option value="${item}" >${item.title}</option>
                                </#list>
                            </select>
                        </div>

                        <label for="lastname" class="col-sm-2 control-label">${I18n.jobinfo_field_childJobId}<font color="black">*</font></label>
                        <div class="col-sm-4"><input type="text" class="form-control" name="childJobId" placeholder="${I18n.jobinfo_field_childJobId_placeholder}" maxlength="100" ></div>
                    </div>

                    <div class="form-group">
                        <label for="firstname" class="col-sm-2 control-label">${I18n.misfire_strategy}<font color="black">*</font></label>
                        <div class="col-sm-4">
                            <select class="form-control" name="misfireStrategy" >
                                <#list MisfireStrategyEnum as item>
                                    <option value="${item}" <#if 'DO_NOTHING' == item >selected</#if> >${item.title}</option>
                                </#list>
                            </select>
                        </div>

                        <label for="firstname" class="col-sm-2 control-label">${I18n.jobinfo_field_executorBlockStrategy}<font color="red">*</font></label>
                        <div class="col-sm-4">
                            <select class="form-control" name="executorBlockStrategy" >
                                <#list ExecutorBlockStrategyEnum as item>
                                    <option value="${item}" >${item.title}</option>
                                </#list>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="lastname" class="col-sm-2 control-label">${I18n.jobinfo_field_timeout}<font color="black">*</font></label>
                        <div class="col-sm-4"><input type="text" class="form-control" name="executorTimeout" placeholder="${I18n.jobinfo_field_executorTimeout_placeholder}" maxlength="6" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" ></div>
                        <label for="lastname" class="col-sm-2 control-label">${I18n.jobinfo_field_executorFailRetryCount}<font color="black">*</font></label>
                        <div class="col-sm-4"><input type="text" class="form-control" name="executorFailRetryCount" placeholder="${I18n.jobinfo_field_executorFailRetryCount_placeholder}" maxlength="4" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" ></div>
                    </div>

					<hr>
					<div class="form-group">
                        <div class="col-sm-offset-3 col-sm-6">
							<button type="submit" class="btn btn-primary"  >${I18n.system_save}</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">${I18n.system_cancel}</button>
                            <input type="hidden" name="id" >
						</div>
					</div>

				</form>
         	</div>
		</div>
	</div>
</div>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  methods: {

  },
};
</script>
