import React from "react";
import { View, Text } from "@tarojs/components";
import "./index.less";

/**
 * 用户协议页面
 * @returns {JSX.Element} 用户协议页面
 */
const AgreementPage: React.FC = () => {
  return (
    <View className="agreement-container">
      <View className="agreement-content">
        <View className="section">
          <Text className="section-title">1. 总则</Text>
          <Text className="section-text">
            欢迎您使用我们的服务。本协议是您与本应用之间关于使用本应用服务所订立的协议。本协议描述了本应用与用户之间关于本应用使用方面的权利义务。用户是指注册、登录、使用本产品的个人或组织。
          </Text>
        </View>

        <View className="section">
          <Text className="section-title">2. 账号注册与使用</Text>
          <Text className="section-text">
            2.1
            用户在使用本服务前需要注册一个账号。账号应当使用真实、准确、有效的信息进行注册。
          </Text>
          <Text className="section-text">
            2.2
            用户应妥善保管账号及密码信息，因账号密码保管不善造成的损失由用户自行承担。
          </Text>
          <Text className="section-text">
            2.3 用户不得将账号借给他人使用，否则用户应当承担由此产生的全部责任。
          </Text>
        </View>

        <View className="section">
          <Text className="section-title">3. 用户行为规范</Text>
          <Text className="section-text">
            3.1 用户在使用本服务时必须遵守中华人民共和国相关法律法规。
          </Text>
          <Text className="section-text">
            3.2
            用户不得利用本应用从事违法违规行为，包括但不限于发布违法信息、侵犯他人知识产权等行为。
          </Text>
          <Text className="section-text">
            3.3 用户应尊重其他用户，不得进行人身攻击、恶意诋毁等行为。
          </Text>
        </View>

        <View className="section">
          <Text className="section-title">4. 服务变更、中断或终止</Text>
          <Text className="section-text">
            4.1
            本应用有权在必要时修改服务条款，服务条款一旦发生变动，将会在页面上公布修改后的服务条款。
          </Text>
          <Text className="section-text">
            4.2
            如发生下列任何一种情形，本应用有权随时中断或终止向用户提供服务而无需通知用户：
            (a) 用户提供的个人资料不真实； (b)
            用户违反本服务条款中规定的使用规则。
          </Text>
        </View>

        <View className="section">
          <Text className="section-title">5. 其他</Text>
          <Text className="section-text">
            5.1 本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。
          </Text>
          <Text className="section-text">
            5.2
            如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AgreementPage;
