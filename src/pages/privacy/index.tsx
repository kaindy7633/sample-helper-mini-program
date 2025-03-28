import React from "react";
import { View, Text } from "@tarojs/components";
import "./index.less";

/**
 * 隐私政策页面
 * @returns {JSX.Element} 隐私政策页面
 */
const PrivacyPage: React.FC = () => {
  return (
    <View className="privacy-container">
      <View className="privacy-content">
        <View className="section">
          <Text className="section-title">1. 引言</Text>
          <Text className="section-text">
            本应用非常重视用户的隐私和个人信息保护。本隐私政策阐述了我们收集、使用、存储和共享您个人信息的方式和目的。请在使用我们的产品和服务前仔细阅读本隐私政策。
          </Text>
        </View>

        <View className="section">
          <Text className="section-title">2. 我们收集的信息</Text>
          <Text className="section-text">
            2.1
            您提供给我们的信息：当您注册账号、完善个人信息或使用我们的服务时，您可能会提供姓名、手机号码、电子邮箱等信息。
          </Text>
          <Text className="section-text">
            2.2
            我们在您使用服务过程中收集的信息：包括设备信息、操作日志等技术信息。
          </Text>
        </View>

        <View className="section">
          <Text className="section-title">3. 我们如何使用收集的信息</Text>
          <Text className="section-text">3.1 提供、维护和改进我们的服务。</Text>
          <Text className="section-text">
            3.2 满足您的个性化需求，例如语言设置、位置设置等。
          </Text>
          <Text className="section-text">
            3.3 通信和服务通知，包括向您发送服务相关的通知。
          </Text>
        </View>

        <View className="section">
          <Text className="section-title">4. 信息安全</Text>
          <Text className="section-text">
            我们采取合理的安全措施来保护您的个人信息免受未经授权的访问、公开披露、使用、修改、损坏或丢失。我们会使用加密技术确保数据的保密性；我们会使用安全防护机制防止数据遭到恶意攻击。
          </Text>
        </View>

        <View className="section">
          <Text className="section-title">5. 您的权利</Text>
          <Text className="section-text">
            根据适用的法律法规，您可能有权访问、更正、删除您的个人信息，以及撤回同意等。您可以通过本应用提供的功能或联系我们的客户服务行使这些权利。
          </Text>
        </View>

        <View className="section">
          <Text className="section-title">6. 隐私政策更新</Text>
          <Text className="section-text">
            我们可能会不时更新本隐私政策。当我们更新隐私政策时，会在应用内发布更新后的隐私政策，并在必要时通知您。建议您定期查看本隐私政策，以了解我们如何保护您的信息。
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PrivacyPage;
