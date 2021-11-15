export const color = {
    red: {
        soft: '#e28080'
        
        strong: '#773636'
        
    }
    
    green: {
        soft: '#81b179'
        
        strong: '#0e4805'
        
    }
    
    white: {
        soft: '#fffcfa'
        
        strong: '#FFF'
        
    }
    
}



2021-11-01 07:05:22.123 [qtp94919826-41] ERROR no.eika.forsikring.helseerklaering.ms.ws.infra.ExceptionMapper - Noe gikk galt: "code=FOR0310001
 name=INTERN_FEIL
 message=Ukjent feil"
2021-11-01 07:05:22.131 [qtp94919826-41] ERROR no.eika.infrastruktur.logfilter.LogFilter - {"stat":500
"cid":"forsikring_person_web"
"rUrl":"http://localhost:9000/forsikring-helseerklaering-ms-ws/rest/resource/sak/v2/72559/provideddata"
"bnr":"4730"
"uid":"25108400318"
"ip":"127.0.0.1"
"rtime":570
"rcid":"268fa190-7e46-49f7-9710-b9344d11fc14"
"method":"GET"
"ctype":"application/json"
"server":"localhost"
"errorCode":"FOR0310001"
"errorName":"INTERN_FEIL"
"errorType":"INTERNAL_ERROR"
"errorMsg":"Ukjent feil"
"developerMessage":"
no.eika.infrastruktur.resource_error.lib.ResourceException: code=FOR0310001
 name=INTERN_FEIL
 message=Ukjent feil
 \tat no.eika.infrastruktur.jersey.client.ext.lib.request.Request.validatedRespons(Request.java:95)
 \tat no.eika.infrastruktur.jersey.client.ext.lib.request.Request.invoke(Request.java:57)
 \tat no.eika.infrastruktur.jersey.client.ext.lib.request.Get.invoke(Get.java:6)
 \tat no.eika.infrastruktur.jersey.client.ext.lib.request.Request.<init>(Request.java:44)
 \tat no.eika.infrastruktur.jersey.client.ext.lib.request.Request.<init>(Request.java:31)
 \tat no.eika.infrastruktur.jersey.client.ext.lib.request.Get.<init>(Get.java:9)
 \tat no.eika.infrastruktur.jersey.client.ext.lib.ClientExt.get(ClientExt.java:105)
 \tat no.eika.forsikring.personforsikring.esb.proxy.kunde.NiceKundeFacadeProxy.hentAlleForsikringerFraAlleBanker(NiceKundeFacadeProxy.java:93)
 \tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
 \tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
 \tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
 \tat java.base/java.lang.reflect.Method.invoke(Method.java:566)
 \tat no.eika.infrastruktur.domene.api.lib.factory.audit.AuditProxy.invoke(AuditProxy.java:96)
 \tat com.sun.proxy.$Proxy113.hentAlleForsikringerFraAlleBanker(Unknown Source)
 \tat no.eika.forsikring.helseerklaering.ms.ws.provideddata.ProvidedDataService.previousCoverExists(ProvidedDataService.kt:86)
 \tat no.eika.forsikring.helseerklaering.ms.ws.provideddata.ProvidedDataService.buildProvidedDataAnswer(ProvidedDataService.kt:63)
 \tat no.eika.forsikring.helseerklaering.ms.ws.provideddata.ProvidedDataService.buildProvidedDataForSak(ProvidedDataService.kt:48)
 \tat no.eika.forsikring.helseerklaering.ms.ws.sak.SakService.getProvidedDataForSak(SakService.kt:68)
 \tat no.eika.forsikring.helseerklaering.ms.ws.sak.SakResource.getProvidedDataForSak$lambda-4(SakResource.kt:61)
 \tat no.eika.forsikring.helseerklaering.ms.ws.infra.Authz.hvisAppTilgang(Authz.java:47)
 \tat no.eika.forsikring.helseerklaering.ms.ws.sak.SakResource.getProvidedDataForSak(SakResource.kt:60)
 \tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
 \tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
 \tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
 \tat java.base/java.lang.reflect.Method.invoke(Method.java:566)
 \tat org.glassfish.jersey.server.model.internal.ResourceMethodInvocationHandlerFactory.lambda$static$0(ResourceMethodInvocationHandlerFactory.java:52)
 \tat org.glassfish.jersey.server.model.internal.AbstractJavaResourceMethodDispatcher$1.run(AbstractJavaResourceMethodDispatcher.java:124)
 \tat org.glassfish.jersey.server.model.internal.AbstractJavaResourceMethodDispatcher.invoke(AbstractJavaResourceMethodDispatcher.java:167)
 \tat org.glassfish.jersey.server.model.internal.JavaResourceMethodDispatcherProvider$TypeOutInvoker.doDispatch(JavaResourceMethodDispatcherProvider.java:219)
 \tat org.glassfish.jersey.server.model.internal.AbstractJavaResourceMethodDispatcher.dispatch(AbstractJavaResourceMethodDispatcher.java:79)
 \tat org.glassfish.jersey.server.model.ResourceMethodInvoker.invoke(ResourceMethodInvoker.java:475)
 \tat org.glassfish.jersey.server.model.ResourceMethodInvoker.apply(ResourceMethodInvoker.java:397)
 \tat org.glassfish.jersey.server.model.ResourceMethodInvoker.apply(ResourceMethodInvoker.java:81)
 \tat org.glassfish.jersey.server.ServerRuntime$1.run(ServerRuntime.java:255)
 \tat org.glassfish.jersey.internal.Errors$1.call(Errors.java:248)
 \tat org.glassfish.jersey.internal.Errors$1.call(Errors.java:244)
 \tat org.glassfish.jersey.internal.Errors.process(Errors.java:292)
 \tat org.glassfish.jersey.internal.Errors.process(Errors.java:274)
 \tat org.glassfish.jersey.internal.Errors.process(Errors.java:244)
 \tat org.glassfish.jersey.process.internal.RequestScope.runInScope(RequestScope.java:265)
 \tat org.glassfish.jersey.server.ServerRuntime.process(ServerRuntime.java:234)
 \tat org.glassfish.jersey.server.ApplicationHandler.handle(ApplicationHandler.java:684)
 \tat org.glassfish.jersey.servlet.WebComponent.serviceImpl(WebComponent.java:394)
 \tat org.glassfish.jersey.servlet.WebComponent.service(WebComponent.java:346)
 \tat org.glassfish.jersey.servlet.ServletContainer.service(ServletContainer.java:366)
 \tat org.glassfish.jersey.servlet.ServletContainer.service(ServletContainer.java:319)
 \tat org.glassfish.jersey.servlet.ServletContainer.service(ServletContainer.java:205)
 \tat org.eclipse.jetty.servlet.ServletHolder$NotAsync.service(ServletHolder.java:1459)
 \tat org.eclipse.jetty.servlet.ServletHolder.handle(ServletHolder.java:799)
 \tat org.eclipse.jetty.servlet.ServletHandler$ChainEnd.doFilter(ServletHandler.java:1631)
 \tat no.eika.infrastruktur.user.servlet.lib.UserContextFilter.doFilter(UserContextFilter.java:117)
 \tat org.eclipse.jetty.servlet.FilterHolder.doFilter(FilterHolder.java:193)
 \tat org.eclipse.jetty.servlet.ServletHandler$Chain.doFilter(ServletHandler.java:1601)
 \tat no.eika.infrastruktur.logfilter.LogFilter.doFilter(LogFilter.kt:67)
 \tat org.eclipse.jetty.servlet.FilterHolder.doFilter(FilterHolder.java:193)
 \tat org.eclipse.jetty.servlet.ServletHandler$Chain.doFilter(ServletHandler.java:1601)
 \tat no.eika.infrastruktur.prometheus.ext.lib.filter.MetricsFilter.doFilter(MetricsFilter.java:123)
 \tat org.eclipse.jetty.servlet.FilterHolder.doFilter(FilterHolder.java:201)
 \tat org.eclipse.jetty.servlet.ServletHandler$Chain.doFilter(ServletHandler.java:1601)
 \tat org.eclipse.jetty.servlet.ServletHandler.doHandle(ServletHandler.java:548)
 \tat org.eclipse.jetty.server.handler.ScopedHandler.handle(ScopedHandler.java:143)
 \tat org.eclipse.jetty.security.SecurityHandler.handle(SecurityHandler.java:600)
 \tat org.eclipse.jetty.server.handler.HandlerWrapper.handle(HandlerWrapper.java:127)
 \tat org.eclipse.jetty.server.handler.ScopedHandler.nextHandle(ScopedHandler.java:235)
 \tat org.eclipse.jetty.server.session.SessionHandler.doHandle(SessionHandler.java:1624)
 \tat org.eclipse.jetty.server.handler.ScopedHandler.nextHandle(ScopedHandler.java:233)
 \tat org.eclipse.jetty.server.handler.ContextHandler.doHandle(ContextHandler.java:1434)
 \tat org.eclipse.jetty.server.handler.ScopedHandler.nextScope(ScopedHandler.java:188)
 \tat org.eclipse.jetty.servlet.ServletHandler.doScope(ServletHandler.java:501)
 \tat org.eclipse.jetty.server.session.SessionHandler.doScope(SessionHandler.java:1594)
 \tat org.eclipse.jetty.server.handler.ScopedHandler.nextScope(ScopedHandler.java:186)
 \tat org.eclipse.jetty.server.handler.ContextHandler.doScope(ContextHandler.java:1349)
 \tat org.eclipse.jetty.server.handler.ScopedHandler.handle(ScopedHandler.java:141)
 \tat org.eclipse.jetty.server.handler.ContextHandlerCollection.handle(ContextHandlerCollection.java:191)
 \tat org.eclipse.jetty.server.handler.HandlerWrapper.handle(HandlerWrapper.java:127)
 \tat org.eclipse.jetty.server.Server.handle(Server.java:516)
 \tat org.eclipse.jetty.server.HttpChannel.lambda$handle$1(HttpChannel.java:400)
 \tat org.eclipse.jetty.server.HttpChannel.dispatch(HttpChannel.java:645)
 \tat org.eclipse.jetty.server.HttpChannel.handle(HttpChannel.java:392)
 \tat org.eclipse.jetty.server.HttpConnection.onFillable(HttpConnection.java:277)
 \tat org.eclipse.jetty.io.AbstractConnection$ReadCallback.succeeded(AbstractConnection.java:311)
 \tat org.eclipse.jetty.io.FillInterest.fillable(FillInterest.java:105)
 \tat org.eclipse.jetty.io.ChannelEndPoint$1.run(ChannelEndPoint.java:104)
 \tat org.eclipse.jetty.util.thread.strategy.EatWhatYouKill.runTask(EatWhatYouKill.java:338)
 \tat org.eclipse.jetty.util.thread.strategy.EatWhatYouKill.doProduce(EatWhatYouKill.java:315)
 \tat org.eclipse.jetty.util.thread.strategy.EatWhatYouKill.tryProduce(EatWhatYouKill.java:173)
 \tat org.eclipse.jetty.util.thread.strategy.EatWhatYouKill.run(EatWhatYouKill.java:131)
 \tat org.eclipse.jetty.util.thread.ReservedThreadExecutor$ReservedThread.run(ReservedThreadExecutor.java:409)
 \tat org.eclipse.jetty.util.thread.QueuedThreadPool.runJob(QueuedThreadPool.java:883)
 \tat org.eclipse.jetty.util.thread.QueuedThreadPool$Runner.run(QueuedThreadPool.java:1034)
 \tat java.base/java.lang.Thread.run(Thread.java:834)
 "
"uAgent":"Jersey/2.27 (HttpUrlConnection 11.0.10)"}
