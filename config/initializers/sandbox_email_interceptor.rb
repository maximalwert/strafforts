class SandboxEmailInterceptor
  def self.delivering_email(message)
    message.to = ['sandbox@strafforts.com']
  end
end

unless Rails.env.production?
  ActionMailer::Base.register_interceptor(SandboxEmailInterceptor)
end
