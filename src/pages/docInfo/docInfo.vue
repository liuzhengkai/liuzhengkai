<template>
  <view>
    <TitleBar class="titleBar" :title-bar-obj="titleBarObj" @goBack="goBack" />
    <view class="list-warpper">
      <view class="info-wrap" v-show="deal == '1'">
        <view class="info-title">网上国网服务账户绑定协议</view>
        <view class="info-p">本版本更新时间：2021年1月17日</view>
        <view class="info-p">欢迎您使用“网上国网”软件及服务！</view>
        <view class="info-p">本协议是申请人与国家电网有限公司（以下简称“国家电网”）就“网上国网”服务账户绑定的相关事宜达成的协议，协议双方应予遵守。</view>
        <view class="info-h4"> 一、关于“网上国网{{appName}}服务” </view>
        <view class="info-p" v-if="env == 'jd' || env == 'swan'">网上国网{{appName}}服务（以下简称“本服务”）是网上国网通过{{companyName}}公司的{{appName}}软件及服务（包括“网上国网”、开发者为“网上国网”的{{appName}}小程序等）为申请人提供的智能互动服务。申请人可通过本服务获取基于申请人在网上国网注册的账户提供的服务。
        </view>
        <view class="info-p" v-else>网上国网{{appName}}服务（以下简称“本服务”）是网上国网通过{{companyName}}公司的{{appName}}软件及服务（包括“网上国网”{{appName}}{{productName}}、以及开发者为“网上国网”的{{appName}}小程序等）为申请人提供的智能互动服务。申请人可通过本服务获取基于申请人在网上国网注册的账户提供的服务。
        </view>
        <view class="info-h4"> 二、声明与承诺 </view>
        <view class="info-p">
          <text class="txt-normal">1.申请人确认：</text>
          <text class="txt-bold">已仔细阅读了本协议，并特别注意了字体加黑的条款，对本协议条款的含义及相应的法律后果已全部知晓并充分理解，愿意遵守其全部内容；“网上国网”已应要求对相关条款进行了充分的提示和说明。如果申请人不同意协议的任何内容，应终止后续操作。</text>
        </view>
        <view class="info-p">
          <text class="txt-bold">2.在申请人（包括申请人的代理人，下同）同意接受本协议并申请开通相关业务功能时，网上国网有理由相信申请人是具有完全民事权利能力和民事行为能力、能够独立承担民事责任的自然人。如不具备前述条件，申请人应该立即停止申请使用本服务。</text>
        </view>
        <view class="info-h4"> 三、账户绑定 </view>
        <view class="info-p">
          <text class="txt-normal">1.申请人同意使用本服务，并自愿将本人的{{appName}}号与本人在网上国网注册的账户进行绑定。</text>
        </view>
        <view class="info-p">
          <text class="txt-normal">2.当申请人按规定步骤操作以申请绑定本人{{appName}}号与网上国网注册账户时，网上国网将根据申请人提供的<text class="txt-bold">网上国网账号、注册手机验证码</text>对申请人的<text
              class="txt-bold">身份及账户信息</text>进行核实。有关信息经核实一致的，网上国网将同意申请人的绑定申请。</text>
        </view>
        <view class="info-p">
          <text class="txt-normal">3.绑定后，网上国网将按约定通过{{appName}}向申请人发送其本人账户的户号绑定记录、交费详情、账户资产等相关信息；申请人也可通过{{appName}}向网上国网直接查询其账户的相关信息，并办理网上国网通过{{appName}}软件提供的相关业务。</text>
        </view>
        <view class="info-p">
          <text class="txt-bold" v-if="env == 'jd' || env == 'swan'">4.本协议生效后，申请人同意接受已绑定网上国网小程序提供的信息服务，含商业性信息服务。</text>
          <text class="txt-bold" v-else>4.本协议生效后，申请人同意接受已绑定网上国网的{{appName}}{{productName}}、小程序提供的信息服务，含商业性信息服务。</text>
        </view>
        <view class="info-p">
          <text class="txt-normal">5.由于申请人变更手机号码，导致与其在网上国网注册手机号不一致而无法接收短信验证码时，将无法通过{{appName}}正常使用需要短信验证码验证的相关功能。如遇此情况，请申请人前往网上国网APP修改绑定手机号码。</text>
        </view>

        <view class="info-h4"> 四、使用规则 </view>
        <view class="info-p">
          <text class="txt-bold">1.凡通过申请人绑定的{{appName}}号向网上国网发送的数据均视为申请人本人发送的数据，申请人应对由此产生的后果负责。</text>
        </view>
        <view class="info-p">
          <text class="txt-bold">2.为保障申请人个人的信息安全，请申请人妥善保管手机、身份证件、账户及密码、{{appName}}用户名及密码等相关信息及可登录至已绑定{{appName}}账号的硬件设备（包括但不限于手机、平板电脑、笔记本电脑、台式电脑等）的安全。申请人如因以上信息、证件及硬件设备泄露、遗失或脱离申请人控制等非网上国网的原因，导致申请人个人信息泄露，网上国网不承担责任。如申请人对本服务显示的信息有任何疑问，请及时联系网上国网客服热线95598进行咨询。</text>
        </view>

        <view class="info-h4"> 五、协议生效、变更及解除 </view>
        <view class="info-p">
          <text class="txt-bold">1.自申请人同意本协议，并将{{appName}}号与申请人的任意一个网上国网注册账户进行绑定，且经网上国网确认成功后本协议生效。</text>
        </view>
        <view class="info-p">
          <text class="txt-bold">2.网上国网有权以网页公告、电子邮件、手机短信或{{appName}}等形式通知申请人本协议内容进行变更。如申请人不同意对本协议的变更，申请人有权向网上国网申请变更或终止相关服务，如申请人在协议变更生效后继续使用本服务，则视为申请人同意网上国网对本协议的变更。</text>
        </view>
        <view class="info-p">
          <text class="txt-bold">3.网上国网可暂停或终止向申请人提供本协议项下服务。网上国网如暂停或终止服务，可采取网站公告、电子邮件、手机短信或{{appName}}等任意一种方式告知申请人。</text>
        </view>
        <view class="info-h4"> 六、不可抗力及免责 </view>
        <view class="info-p">
          <text class="txt-bold">您需要理解并同意，在使用本服务及关联服务的过程中，可能会遇到不可抗力等风险因素，使本软件能够提供的全部或部分服务受到影响。不可抗力是指不能预见、不能克服并不能避免且对一方或双方造成重大影响的客观事件，包括但不限于自然灾害以及社会事件如战争、动乱、政府行为等。出现上述情况时，国家电网将努力在第一时间与相关单位配合，争取及时进行处理，但是由此给您造成的损失，国家电网不予承担。</text>
        </view>
        <view class="info-h4"> 七、风险提示 </view>
        <view class="info-p">
          <text class="txt-bold">1.申请人使用本协议项下的服务所进行的交易，以及因交易产生的结果，与申请人通过网上国网APP等其他渠道进行的同种交易发生相同的法律效力，双方权利义务按相应交易规则确定。</text>
        </view>
        <view class="info-p">
          <text class="txt-bold">2.如申请人未履行本协议项下相关义务，可能导致资金损失、信息泄露等风险，且相应不利后果应由申请人自行承担。</text>
        </view>
        <view class="info-h4"> 八、法律适用及争议解决 </view>
        <view class="info-p">
          <text class="txt-normal">1.本协议之订立、生效、解释、履行等均适用中华人民共和国法律（为本协议之目的，不包括香港特别行政区、澳门特别行政区及台湾地区法律）。</text>
        </view>
        <view class="info-p">
          <text class="txt-bold">2.双方在履行本协议的过程中，如发生争议，应协商解决。协商不成的，任何一方均可在网上国网软件注册地有管辖权的人民法院提起诉讼。在诉讼期间，本协议不涉及争议部分的条款仍须履行。</text>
        </view>
      </view>
      <view class="info-wrap" v-show="deal == '2'">
        <view class="info-title">“网上国网”隐私声明</view>
        <view class="info-p">生效日期：2021年8月26日</view>
        <view class="info-h4">提示条款 </view>
        <view class="info-p">尊敬的用户：</view>
        <view class="info-p">国家电网有限公司及旗下为您提供“网上国网”移动应用服务的国家电网有限公司客户服务中心（以下统称“国网”或“我们”）非常重视对用户个人信息及隐私权的保护，我们深知个人信息对您的重要性，并会尽全力保护您个人信息的安全。我们致力于维持您对我们的信任，恪守以下原则，保护您的个人信息：权责一致原则、目的明确原则、选择同意原则、最少必要原则、公开透明原则、确保安全原则、主体参与原则等。同时，我们承诺采取相应的安全保护措施来保护您的个人信息。因此我们制订了涵盖如何收集、存储、使用、共享和保护用户信息的
          <text class="txt-bold txt-underline">《“网上国网”隐私声明》（以下简称“本隐私声明”或“本声明”）</text>。
        </view>
        <view class="info-p txt-bold txt-underline">本隐私声明适用于“网上国网”App（以下简称“本平台”）。如您使用本平台提供的某项或某几项服务有其单独的隐私声明与/或其它协议、合同、声明，该等服务对应的隐私声明与/或其它协议、合同、声明将与本隐私声明一起构成一份完整的隐私声明。</view>
        <view class="info-p txt-bold txt-underline">需要特别说明的是，本隐私声明不适用于其他第三方向您提供的服务，也不适用于国家电网有限公司和/或其关联公司已另行独立设置隐私声明的产品及/或服务。您在使用其他国家电网有限公司和/或其关联公司以及其他第三方为您提供的移动应用服务时，您需要同意其为您提供的隐私声明。</view>
        <view class="info-p txt-bold txt-underline">在使用我们各项产品及/或服务前，请您务必仔细阅读并透彻理解本隐私声明，特别是以粗体/粗体下划线标识的条款，您应重点阅读，在确认充分理解并同意后再开始使用相关产品及/或服务。阅读过程中，如果您有任何疑问、意见或建议，请通过以下联系方式与我们联系：</view>
        <view class="info-p">（1）联系地址：天津市东丽区东丽湖丽湖环路21号
          国家电网有限公司客户服务中心</view>
        <view class="info-p">（2）电话：95598 </view>
        <view class="info-p">（3）传真：022-59013362</view>
        <view class="info-p">（4）个人信息保护相关负责人邮箱：zsdl2019@sgcc.com.cn</view>
        <view class="info-p">
          <text class="txt-bold txt-underline">如您不同意本隐私声明中的任何条款，您应立即停止访问或使用相关服务。</text>如果您使用或继续使用相关产品及/或服务，则视为您同意本隐私声明中的内容</view>
        <view class="info-p txt-bold txt-underline">此外，“网上国网”会定期或不定期地进行更新，其中部分产品或服务在更新后收集使用个人信息的目的、方式、范围可能发生变化，届时，“网上国网”隐私声明中的某些条款也会做出相应的调整，我们会在本声明中某些条款变更后提醒您重新阅读隐私声明。</view>
        <view class="info-h4">术语与定义 </view>
        <view class="info-p">
          <text class="txt-bold">本平台：</text>指名称为“网上国网”的移动客户端。</view>
        <view class="info-p">
          <text class="txt-bold">个人信息（personal information）：</text>指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。</view>
        <view class="info-p">个人信息包括姓名、出生日期、身份证件号码、个人生物识别信息、住址、通信通讯联系方式、通信记录和内容、账号密码、财产信息、征信信息、行踪轨迹、住宿信息、健康生理信息、交易信息等。</view>
        <view class="info-p">
          <text class="txt-bold">个人敏感信息（personal sensitive information）：</text>指一旦泄露、非法提供或滥用可能危害人身和财产安全，极易导致个人名誉、身心健康受到损害或歧视性待遇等的个人信息。</view>
        <view class="info-p">个人敏感信息包括身份证件号码、个人生物识别信息、银行账户、通信记录和内容、财产信息、征信信息、行踪轨迹、住宿信息、健康生理信息、交易信息、14岁以下（含）儿童的个人信息等<text
            class="txt-bold">（我们将在本隐私声明中对具体个人敏感信息以粗体进行显著标识）</text></view>
        <view class="info-p">
          <text class="txt-bold">个人信息主体（personal information subject）：</text>个人信息所标识或者关联的自然人。</view>
        <view class="info-p">
          <text class="txt-bold">个人信息控制者（personal information controller）：</text>有能力决定个人信息处理目的、方式等的组织或个人。</view>
        <view class="info-p">
          <text class="txt-bold">收集（collect）：</text>获得个人信息的控制权的行为。</view>
        <view class="info-p">包括由个人信息主体主动提供、通过与个人信息主体交互或记录个人信息主体行为等自动采集行为，以及通过共享、转让、搜集公开信息等间接获取个人信息等行为。</view>
        <view class="info-p">
          <text class="txt-bold">明示同意（explicit consent）：</text>个人信息主体通过书面、口头等方式主动做出纸质或电子形式的声明，或者自主作出肯定性动作，对其个人信息进行特定处理作出明确授权的行为。肯定性动作包括个人信息主体主动勾选、主动点击“同意”、“注册”、“发送”、“拨打”、主动填写或提供等。</view>
        <view class="info-p">
          <text class="txt-bold">授权同意（consent）：</text>个人信息主体对其个人信息进行特定处理作出明确授权的行为。包括通过积极的行为作出授权，或者通过消极的不作为而作出授权。</view>
        <view class="info-p">
          <text class="txt-bold">用户画像（user profiling）：</text>通过收集、汇聚、分析个人信息，对某特定自然人个人特征，如职业、经济、健康、教育、个人喜好、信用、行为等方面作出分析或预测，形成其个人特征模型的过程。</view>
        <view class="info-p">
          <text class="txt-bold">个人信息安全影响评估（personal information security impact
            assessment）：</text>针对个人信息处理活动，检验其合法合规程度，判读其对个人信息主体合法权益造成损害的各种风险，以及评估用于保护个人信息主体的各项措施有效性的过程。</view>
        <view class="info-p">
          <text class="txt-bold">删除（delete）：</text>在实现日常业务功能所涉及的系统中去除个人信息的行为，使其保持不可被检索、访问的状态。</view>
        <view class="info-p">
          <text class="txt-bold">公开披露公开披露（public disclosure）：</text>向社会或不特定人群发布信息的行为。</view>
        <view class="info-p">
          <text class="txt-bold">转让（transfer of control）：</text>将个人信息控制权由一个控制者向另一个控制者转移的过程。</view>
        <view class="info-p">
          <text class="txt-bold">共享（sharing）：</text>个人信息控制者向其他控制者提供个人信息，且双方分别对个人信息拥有独立控制权的过程。</view>
        <view class="info-p">
          <text class="txt-bold">匿名化（anonymization）：</text>通过对个人信息的技术处理，使得个人信息主体无法被识别或者关联，且处理后的信息不能被复原的过程。</view>
        <view class="info-p">
          <text class="txt-bold">去标识化（de-identification）：</text>通过对个人信息的技术处理，使其在不借助额外信息的情况下，无法识别或者关联个人信息主体的过程。</view>
        <view class="info-p">
          <text class="txt-bold">个性化展示（personalized display）：</text>基于特定个人信息主体的网络浏览历史、兴趣爱好、消费记录和习惯等个人信息，向该个人信息主体展示信息内容、提供商品或服务的搜索结果等活动。。</view>
        <view class="info-p">
          <text class="txt-bold">业务功能（business function）：</text>满足个人信息主体的具体使用需求的服务类型。</view>
        <view class="info-p">
          <text class="txt-bold">关联公司（Affiliated Company）：</text>指一方控制、共同控制另一方或对另一方施加重大影响,以及两方或两方以上同受一方控制、共同控制的任何公司。“控制”是指有权决定一个企业或机构的财务和经营政策,并能据以从该企业或机构的经营活动中获取利益。“共同控制”是指按照合同约定对某项经济活动所共有的控制，仅在与该项经济活动相关的重要财务和经营决策需要分享控制权的投资方一致同意时存在。“重大影响”是指对一个企业或机构的财务和经营政策有参与决策的权力,但并不能够控制或者与其他方一起共同控制这些政策的制定。</view>

        <view class="info-h4">本声明确立的基本原则 </view>
        <view class="info-p">“网上国网”开展收集、存储、使用、共享、转让、公开披露、删除等个人信息处理活动完全遵循合法、正当、必要的原则，具体包括：</view>
        <view class="info-p">a)权责一致：采取技术和其他必要的措施保障个人信息的安全，对其个人信息处理活动对个人信息主体合法权益造成的损害承担责任。</view>
        <view class="info-p">b)目的明确：具有明确、清晰、具体的个人信息处理目的。</view>
        <view class="info-p">c)选择同意：向个人信息主体明示个人信息处理目的、方式、范围等规则，征求其授权同意。</view>
        <view class="info-p">d)最小必要：只处理满足个人信息主体授权同意的目的所需的最少个人信息类型和数量。目的达成后，应及时删除个人信息。</view>
        <view class="info-p">e)公开透明：以明确、易懂和合理的方式公开处理个人信息的范围、目的、规则等，并接受外部监督。</view>
        <view class="info-p">f)确保安全：具备与所面临的安全风险相匹配的安全能力，并采取足够的管理措施和技术手段，保护个人信息的保密性、完整性、可用性。</view>
        <view class="info-p">g)主体参与：向个人信息主体提供能够查询、更正、删除其个人信息，以及撤回授权同意、注销账户、投诉等方法。</view>

        <view class="info-h4">本隐私声明将帮助您了解以下内容 </view>
        <view class="info-p">一、我们如何收集和使用您的个人信息</view>
        <view class="info-p">二、我们如何使用 Cookie 和同类技术</view>
        <view class="info-p">三、我们如何共享、转让、公开披露您的个人信息</view>
        <view class="info-p">四、我们如何保护和保存您的个人信息</view>
        <view class="info-p">五、您如何管理您的个人信息</view>
        <view class="info-p">六、我们如何处理未成年人的个人信息</view>
        <view class="info-p">七、通知和修订</view>
        <view class="info-p">八、如何联系我们</view>
        <view class="info-p">九、投诉、举报</view>

        <view class="info-h4">一、我们如何收集和使用您的个人信息</view>

        <view class="info-h4">（一）我们收集您的个人信息的规则</view>
        <view class="info-p">（1）收集个人信息的合法性</view>
        <view class="info-p">我们不会以欺诈、诱骗、误导等方式收集您的个人信息。</view>
        <view class="info-p">我们不会隐瞒产品及/或服务所具有的收集个人信息的功能。</view>
        <view class="info-p">我们不会从非法渠道获取您的个人信息。</view>
        <view class="info-p">我们将以公开、公正的方式向您明示产品及/或服务收集及使用您个人信息的类型及方式，确保经您同意及授权后才开始收集及使用您的个人信息，并且在收集使用个人信息的目的、方式、范围发生变化时通过消息推送的方式向您发起告知，提醒您阅读发生变化的条款。</view>
        <view class="info-p">（2）收集个人信息的最小必要</view>
        <view class="info-p">我们收集您个人信息的类型与实现产品及/或服务的业务功能直接关联，如缺少某些必要的个人信息，直接关联的业务功能将无法实现。</view>
        <view class="info-p">我们采集您个人信息的频率是实现产品及/或服务的业务功能所必需的最低频率。</view>
        <view class="info-p">我们通过间接方式获取个人信息的数量是实现产品及/或服务的业务功能所必需的最少数量。</view>
        <view class="info-p">（3）多项业务功能的自主选择</view>
        <view class="info-p">“网上国网”为您提供了多项业务功能，在您使用产品及/或服务时，我们不会通过捆绑产品及/或服务各项业务功能的方式，要求您一次性接受并授权同意其它未申请或使用的业务功能收集个人信息的请求。</view>
        <view class="info-p">我们确定在您自主作出肯定性动作，如：主动点击、勾选、填写等，作为产品及/或服务特定业务功能的开启条件，且仅在您开启业务功能后，开始收集相关的个人信息。</view>
        <view class="info-p">您在选择关闭或退出特定业务功能后，我们将停止该业务功能对您个人信息的收集。</view>
        <view class="info-p">如您不授权同意使用、关闭或退出特定业务功能，我们不会频繁征求您的授权同意。</view>
        <view class="info-p">如您不授权同意使用、关闭或退出特定业务功能，并不影响您自主选择使用的其他业务功能，或降低其他业务功能的服务质量。</view>
        <view class="info-p">我们不会仅以改善服务质量、提升使用体验、研发新产品、增强安全性等为由，强制要求您同意我们收集您的个人信息。</view>

        <view class="info-h4">（二）收集使用的个人信息及收集使用的目的、方式、范围</view>
        <view class="info-p">在您使用我们的产品及/或服务时，我们需要/可能需要收集和使用的您的个人信息包括如下两种：</view>
        <view class="info-p">
          <text class="txt-bold">1.核心业务功能：</text>我们仅会出于以下核心业务功能的需要，收集和使用您的个人信息，<text class="txt-bold txt-underline">该等核心业务功能是为了向您提供我们产品及/或服务的基本功能。如您拒绝提供相应信息，您将无法正常使用我们的全部或部分产品及/或服务。</text></view>
        <view class="info-p">（1）帮助您成为我们的注册用户</view>
        <view class="info-p">为帮助您注册成为我们的用户，以便我们为您提供用户服务，您需要<text class="txt-bold">提供您的手机号码并设置登录密码</text>
          ，用于创建本平台账户。如果您仅需在“热点”（不含“国网招聘”）功能模块中浏览资讯、查找服务网点（包含“电力营业厅”、“电力交费点”、“电动汽车体验中心”）、了解用电知识、查看公示信息、了解客户工程市场、查看商城售卖的商品信息（包括“e享家”、“节能产品”、“电工电气”、“设备采购”等功能模块）以及使用“搜索”等功能，您不需要注册成为我们的用户及提供上述信息。</view>
        <view class="info-p">对于需要通过本平台用户账户才能使用的服务，我们可能会根据您提供的上述信息校验您的用户身份，确保我们是在为您本人提供服务。</view>
        <view class="info-p">（2）帮助您登录本平台</view>
        <view class="info-p">为帮助您登录本平台，以便我们为您提供用户服务，您至少需要提供<text class="txt-bold">手机号码、登录密码</text>
          信息。登录本平台后，我们建议您完善您的个人信息，并绑定您及其他您需要关注的用电户号（如家人用电户号），以便获取我们将为您提供的完整服务。</view>
        <view class="info-p">如您暂时未完善您的个人信息，且未绑定任何用电户号，除了不需注册即可使用的服务功能以外，您还可以使用有限的功能，包括：故障报修、关键字搜索停电信息、在“交费盈”功能模块中查看理财产品说明、在“电e票”功能模块中查看产品介绍及贴息计算、在“电e贷”功能模块中查看产品介绍等等。</view>
        <view class="info-p">（3）完善您的个人信息</view>
        <view class="info-p">为落实网络实名制管理要求，并为您提供更好的服务，我们建议您提供<text class="txt-bold">姓名、身份证号码</text> 信息，以便于完成实名认证过程。<text
            class="txt-bold">姓名、身份证号码</text>请您知悉：个人身份信息属于敏感信息，请您谨慎提供，并且，同一身份信息只能实名一次，提供后将无法修改。 </view>
        <view class="info-p">此后，您还可以通过录入您的<text class="txt-bold">面部信息、指纹信息、手势密码信息</text>以便于通过这些方式登录本平台。如您忘记登录密码需要重置时，我们需要验证您的身份信息，包括<text
            class="txt-bold">手机号码、面部特征</text>信息。我们还会收集<text class="txt-bold">设备信息</text>用于硬件绑定和登录安全加固。如您不提供以上信息，您将无法登录或者找回密码，但这不影响您正常使用未登录情况下可用的功能或服务。</view>
        <view class="info-p">（4）使用实名认证服务</view>
        <view class="info-p">当您使用实名认证服务时，您需要提供<text class="txt-bold">姓名、身份证号码、身份证照片和面部特征</text>
          信息，以便于验证您的身份，如您拒绝提供该信息，仅会使您无法使用以实名认证为前提条件的相关功能，但不影响您正常使用本平台的其它功能。 </view>
        <view class="info-p">（5）在您使用我们服务的过程中，为了识别账号异常状态、了解产品适配性、向您提供更契合您需求的个性化、定制化页面展示和搜索结果，我们可能会自动收集您的使用情况并存储为网络日志信息，包括：</view>
        <view class="info-p">
          <text class="txt-bold">设备信息：</text>
          我们会根据您在App安装及/或使用中的具体操作，接收并记录您所使用的设备相关信息
          <text class="txt-bold">（包括设备型号、操作系统版本、UI版本、基带版本、内核版本、设备设置、唯一设备标识符、设备环境软硬件特征信息）、设备所在位置相关信息（包括您授权的GPS位置以及WLAN接入点、蓝牙和基站传感器信息）。</text>

        </view>
        <view class="info-p">
          <text class="txt-bold">服务日志信息：</text>
          当您使用本平台与/或服务时，我们会自动搜集您使用我们服务的详细使用情况，作为服务日志保存，包括
          <text class="txt-bold">IP地址、浏览器类型、WLAN MAC地址、电信运营商、使用语言、功能操作步骤、访问日期和时间等。</text>
        </view>
        <view class="info-p">（6）使用户主认证服务</view>
        <view class="info-p">
          当您需要使用户主认证服务时，您必须先通过实名认证。您需要提供
          <text class="txt-bold">交费地区及用电户号</text>
          信息，以便于验证户主身份。此外，您可能还需提供
          <text class="txt-bold">产权人身份证、户口本、公安局变更证明、企业名称变更核准通知书（企业用户）材料以及产权相关证明资料、产权人姓名、产权人身份证号码、手机号码及产权合法证明信息。</text>
          如您拒绝提供该信息，仅会使您无法使用以户主认证为前提的相关功能，但不影响您正常使用本平台的其它功能。如果您委托他人办理此项业务，则还需提供
          <text class="txt-bold">经办人姓名、手机号码、经办人身份证、授权委托书</text>
          资料。在完成户主认证的过程中，可能需要您阅读并确认
          <text class="txt-bold">《低压过户业务办理需知》</text>
          及其它 。
        </view>
        <view class="info-p">（7）使用办电服务</view>
        <view class="info-p">
          当您使用办电服务时，您可能需要提供您的
          <text class="txt-bold">地理位置信息、用电户号、身份证明、产权证明、企业主体证明、手机号码、名称变更证明照片</text>
          信息，目的是为了向您提供相应服务。如果您委托他人办理此项业务，则还需提供
          <text class="txt-bold">经办人姓名、手机号码、授权委托书</text>
          资料。如您拒绝提供该信息，您将无法使用上述功能，但这不影响您正常使用本平台的其它功能。
        </view>

        <view class="info-p">（7）使用交费支付服务</view>
        <view class="info-p">
          当您使用交费支付服务时，您需要提供
          <text class="txt-bold">持卡人姓名、银行卡号、交费地区、用电户号</text>
          信息用于办理交费业务。如您拒绝提供该信息，您将无法使用上述功能，但这不影响您正常使用本平台的其它功能。在办理该业务时，您需要阅读并同意
          <text class="txt-bold">《自动交费服务协议》。</text>
        </view>

        <view class="info-p">（8）使用电商服务</view>
        <view class="info-p">
          当您使用诸如“设备采购”、“买桩”等面向个人的电商服务时，您需要提供
          <text class="txt-bold">收货人姓名、收货地址、收货人联系电话信息，</text>
          用于顺利完成交易。我们还会收集您输入的收货地址信息形成列表，以便于您下次快速提交订单，您可以选择将其从收货地址列表中删除。如您拒绝提供该信息，您将无法使用上述功能，但这不影响您正常使用本平台的其它功能。
        </view>

        <view class="info-p">（9）使用短信通知、消息推送服务</view>
        <view class="info-p">
          当您使用短信通知、消息推送服务时，我们会收集您的
          <text class="txt-bold">手机号码、设备信息、账户信息及交易信息，</text>
          以便及时向您发送相关交易通知。如您不提供以上信息，将无法使用此类通知和消息服务。但这不影响您正常使用本平台的其它功能。
        </view>


        <view class="info-p">（10）使用查询服务</view>
        <view class="info-p">
          当您使用查询服务时，如您是个人用户，您可能需要提供
          <text class="txt-bold">户号、地理位置信息，</text>
          以便本平台为您提供相关查询服务。如您是企事业单位用户，则您需提供您所在的
        </view>

      </view>
    </view>
  </view>
</template>
<script>
  import "./docInfo.scss";
  import Taro from "@tarojs/taro";
  import TitleBar from "@/components/titleBar/titleBar";
  export default {
    /**
     * 页面的初始数据
     */
    data() {
      return {
        titleBarObj: {
          title: "详情",
          isOpenAlipayJump: false, // 返回到指定页面
          tokenBol: false, // 点击返回退出
          arrowWhite: true, //箭头默认false为黑色，ture为白色
          // isNoShowArrow: true // 不显示箭头，默认false;  显示，true
        },
        deal: "1",
        companyName: '',
        appName: '',
        productName: '',
        env: ''
      }
    },
    components: {
      TitleBar
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onLoad: function(options) {
      this.env = process.env.TARO_ENV;
      if (options.index == "0") {
        this.deal = "1";
      } else if (options.index == "1") {
        this.deal = "2";
      }
    },
    mounted(){
      if (process.env.TARO_ENV == 'weapp') {
        this.companyName = '腾讯'
        this.appName = '微信'
        this.productName = '公众号'
      } else if (process.env.TARO_ENV == 'alipay') {
        this.companyName = '支付宝'
        this.appName = '支付宝'
        this.productName = '生活号'
      } else if (process.env.TARO_ENV == 'swan') {
        this.companyName = '百度'
        this.appName = '百度'
        this.productName = ''
      } else if (process.env.TARO_ENV == 'jd') {
        this.companyName = '京东'
        this.appName = '京东'
        this.productName = ''
      } else {
        //其他
        this.companyName = ''
        this.appName = ''
        this.productName = ''
      }
    },
    methods: {
      goBack() {
        Taro.navigateBack({
          delta: 1,
        });
      }
    },
    onShareAppMessage(res) {
      return {
        title: '网上国网',
        desc: '电费轻松缴纳，随时随地享受便捷服务。',
        path: 'pages/index/index',
        channel:'Wxfriends,Wxmoments',
      }
    },
  };
</script>

<style>
  .info-wrap {
    color: #000;
  }

  .info-title {
    font-size: 32rpx;
    text-align: center;
    line-height: 40rpx;
    text-indent: 50rpx;
  }

  .info-p {
    font-size: 24rpx;
    line-height: 40rpx;
    text-indent: 50rpx;
  }

  .info-h4 {
    font-size: 30rpx;
    line-height: 40rpx;
    text-indent: 50rpx;
  }

  .txt-bold {
    font-weight: 700;
    font-size: 24rpx;
    line-height: 40rpx;
    text-indent: 50rpx;
  }

  .txt-underline {
    text-decoration: underline;
  }

  .txt-normal {
    font-size: 24rpx;
    line-height: 40rpx;
    text-indent: 50rpx;
  }
</style>
