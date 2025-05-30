import React, { useState } from "react";
import { Modal, Text, Box, Button, FONT_SIZES } from "../../components";
import { COLORS } from "../../constants";
import { ACCEPT_TERMS_MUTATION } from "../../graphql/mutations";

const TermsAgreement = ({ state, onClose, client, dispatch }) => {
  const [loading, setLoading] = useState(false);

  const handleAcceptTerms = async () => {
    try {
      setLoading(true);
      const variables = {
        accept: true,
      };
      const { termsAgreement } = await client.request(
        ACCEPT_TERMS_MUTATION,
        variables
      );
      dispatch({ type: "UPDATE_USER_TERMS", payload: termsAgreement.terms });
      setLoading(false);
      onClose();
    } catch (err) {
      console.log("err accepting terms: ", err);
    }
  };

  return (
    <Modal
      isLoading={loading}
      onClose={onClose}
      height={"80%"}
      state={state}
      width="90%"
    >
      <Box
        column
        width={"100%"}
        height={"100%"}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box column width="100%" style={{ overflow: "scroll" }}>
          <Text center bold fontSize={FONT_SIZES.X_LARGE}>
            GoneChatting Terms and Conditions of Use
          </Text>
          <Text>
            Welcome to GoneChatting’s Terms and Conditions of Use (these
            “Terms”). This is a contract between you and the GoneChatting Group
            (as defined further below) and we want you to know yours and our
            rights before you use the GoneChatting website or application
            (“GoneChatting” or the “App”). Please take a few moments to read
            these Terms before enjoying the App, because once you access, view,
            or use the App, you are going to be legally bound by these Terms (so
            probably best to read them first!).
          </Text>
          <Text bold>
            Please be aware that if you subscribe to services for a term (the
            “Initial Term”), then the terms of your subscription will be
            automatically renewed for additional periods of the same duration as
            the Initial Term at GoneChatting’s then-current fee for such
            services, unless you cancel your subscription in accordance with
            Section 5 below.
          </Text>
          <Text bold center fontSize={FONT_SIZES.X_LARGE}>
            1. Subscription and Payment Terms
          </Text>
          <Text>
            GoneChatting offers various subscription plans. By subscribing to
            one of our plans, you agree to pay the subscription fee specified at
            the time of purchase. All payments will be charged to your iTunes
            account upon confirmation of purchase.
          </Text>
          <Text>
            Subscriptions automatically renew unless auto-renew is turned off at
            least 24 hours before the end of the current period. Your account
            will be charged for renewal within 24 hours prior to the end of the
            current period, at the same cost as your initial subscription unless
            otherwise specified. You can manage your subscription and turn off
            auto-renewal by going to your Account Settings after purchase.
          </Text>
          <Text>
            Any unused portion of a free trial period, if offered, will be
            forfeited when you purchase a subscription, where applicable.
          </Text>
          <Text bold>Refunds</Text>
          <Text>
            If you subscribed using your Apple ID, refunds are handled by Apple,
            not GoneChatting. To request a refund, please visit{" "}
            <a href="https://getsupport.apple.com">
              https://getsupport.apple.com
            </a>
            . GoneChatting does not provide refunds for any subscriptions
            purchased through the App Store.
          </Text>
          <Text bold center fontSize={FONT_SIZES.X_LARGE}>
            2. Privacy and Data Protection
          </Text>
          <Text>
            We take your privacy very seriously and are committed to protecting
            your personal information. In compliance with our agreements with
            third-party service providers such as Twilio, we ensure that your
            phone number and other personal information are not shared with
            third parties. Your phone number will be used solely for
            verification purposes and will not be disclosed, sold, or rented to
            any third party for any reason. For more details, please refer to
            our{" "}
            <a href="https://candyman999.github.io/goneChattingSupport/">
              Privacy Policy
            </a>
            .
          </Text>
          <Text bold center fontSize={FONT_SIZES.X_LARGE}>
            3. GoneChatting RULES
          </Text>
          <Text>
            Before you can use the App, you will need to register for an account
            (“Account”). In order to create an Account, you must:
          </Text>
          <ol>
            <li>
              <Text>
                be at least 18 years old or the age of majority to legally enter
                into a contract under the laws of your home country; and
              </Text>
            </li>
            <li>
              <Text>
                be legally permitted to use the App by the laws of your home
                country.
              </Text>
            </li>
          </ol>
          <Text>
            You can create an Account via manual registration or by using your
            Google or Apple login details. If you create an Account using your
            Google or Apple login details, you authorize us to access, display,
            and use certain information from your account (e.g. profile
            pictures, email, name). For more information about what information
            we use and how we use it, please check out our{" "}
            <a href="https://candyman999.github.io/goneChattingSupport/">
              Privacy Policy
            </a>
            . By using our App, you acknowledge that we may collect and use your
            data and information in accordance with our Privacy Policy.
          </Text>
          <Text>
            Unfortunately, we cannot allow you to use another person’s Account
            or to share your Account with any other person without permission.
          </Text>
          <Text>
            You’ll have great fun on GoneChatting, but if you feel the need to
            leave, you can delete your Account at any time by going to the
            ‘Profile’ page when you are logged in and clicking on the ‘Delete
            account’ button under your settings. Your Account will be deleted
            immediately but it may take a little while for Your Content (defined
            below) to be completely removed from the App. Your profile
            information will be treated in accordance with our Privacy Policy.
            If you delete your Account and try to create a new account within
            this time period using the same credentials, we will re-activate
            your Account for you.
          </Text>
          <Text>
            We use a combination of automated systems and a team of moderators
            to monitor and review accounts and messages for content that
            indicates breaches of these Terms. We reserve the right at our sole
            discretion to terminate or suspend any Account, restrict access to
            the App, or make use of any operational, technological, legal, or
            other means available to enforce the Terms (including without
            limitation blocking specific IP addresses), at any time without
            liability and without the need to give you prior notice. Without
            limiting the foregoing in any way, we expressly reserve the right to
            terminate or suspend your Account without notice (1) for violating
            these terms, (2) due to your conduct on the App, or your conduct
            with other users of the App (including your “offline” conduct), if
            we, in our sole discretion, determine your conduct was inappropriate
            or improper, (3) if we or our affiliates, in our or their sole
            discretion, determine your conduct on other apps operated by our
            affiliates was inappropriate or improper, or (4) for any reasons
            whatsoever that we deem, in our sole discretion, justifies
            termination. If your Account is terminated or suspended, you agree
            you will not receive a refund for any paid service or features you
            have already been charged for.
          </Text>
          <Text bold center fontSize={FONT_SIZES.X_LARGE}>
            4. End User License Agreement (EULA)
          </Text>
          <Text>
            By using the GoneChatting application, you agree to abide by the
            terms set forth in the Apple End User License Agreement (EULA). The
            standard Apple EULA governs the use of our application and can be
            reviewed in full at the following link:
            <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">
              https://www.apple.com/legal/internet-services/itunes/dev/stdeula/
            </a>
            .
          </Text>

          <Text bold center fontSize={FONT_SIZES.X_LARGE}>
            5. Types of Content
          </Text>
          <Text>Content that you upload and provide (“Your Content”);</Text>
          <ol>
            <li>
              <Text>Content that members provide (“Member Content”); and</Text>
            </li>
            <li>
              <Text>
                Content that the GoneChatting Group provides (including, without
                limitation, database(s) and/or software) (“Our Content”).
              </Text>
            </li>
          </ol>
          <Text bold>
            There is certain content we can’t allow on GoneChatting
          </Text>
          <Text>
            We want our users to be able to express themselves as much as
            possible and post all sorts of things on GoneChatting, but we have
            ZERO TOLERANCE on certain content which:
          </Text>
          <ul>
            <li>
              <Text>
                contains language or imagery which could be deemed offensive or
                is likely to harass, upset, embarrass, alarm or annoy any other
                person (including for example and without limitation, language
                that could be deemed discriminatory towards an individual’s
                race, color, ethnicity, national origin, religion, disability,
                sexual orientation, gender expression, gender identity, or
                physical appearance);
              </Text>
            </li>
            <li>
              <Text>
                is obscene, pornographic, violent or otherwise may offend human
                dignity;
              </Text>
            </li>
            <li>
              <Text>
                is abusive, insulting or threatening, discriminatory or which
                promotes or encourages racism, sexism, hatred, or bigotry;
              </Text>
            </li>
            <li>
              <Text>
                encourages any illegal activity including, without limitation,
                terrorism, inciting racial hatred, or the submission of which in
                itself constitutes committing a criminal offense;
              </Text>
            </li>
            <li>
              <Text>is defamatory or libelous;</Text>
            </li>
            <li>
              <Text>
                relates to commercial activities (including, without limitation,
                sales, competitions, and advertising, links to other websites or
                premium line telephone numbers);
              </Text>
            </li>
            <li>
              <Text>involves the transmission of “junk” mail or “spam”;</Text>
            </li>
            <li>
              <Text>
                contains any spyware, adware, viruses, corrupt files, worm
                programs, or other malicious code designed to interrupt, damage
                or limit the functionality of or disrupt any software, hardware,
                telecommunications, networks, servers or other equipment, Trojan
                horse or any other material designed to damage, interfere with,
                wrongly intercept or expropriate any data or personal
                information whether from GoneChatting or otherwise;
              </Text>
            </li>
            <li>
              <Text>
                itself, or the posting of which, infringes any third party’s
                rights (including, without limitation, intellectual property
                rights and privacy rights);
              </Text>
            </li>
            <li>
              <Text>
                shows another person which was created or distributed without
                that person’s consent;
              </Text>
            </li>
            <li>
              <Text>is harmful to minors; or</Text>
            </li>
            <li>
              <Text>
                impersonates any other person, including falsely stating your
                name.
              </Text>
            </li>
          </ul>
          <Text>
            GoneChatting Group operates a zero-tolerance policy for this kind of
            content.
          </Text>
          <Text bold center fontSize={FONT_SIZES.X_LARGE}>
            7. Your Content Guidelines
          </Text>
          <Text>
            You agree that Your Content must comply with our Guidelines as
            updated from time to time. As Your Content is unique, you are
            responsible and liable for Your Content and will indemnify, defend,
            release, and hold us harmless from any claims made in connection
            with Your Content.
          </Text>
          <Text>
            These Guidelines and our Terms and Conditions are designed to ensure
            every user has a safe and enjoyable experience on GoneChatting.
            Failure to adhere to these guidelines may result in losing access to
            our platform.
          </Text>
          <Text bold>Upload only your own photos</Text>
          <Text>
            We take copyrights very seriously. If you don’t own the rights to a
            photo or video, please don’t post it.
          </Text>
          <Text bold>Respect all users</Text>
          <Text>
            We’re a very diverse community. This means you should respect other
            people’s beliefs, interests and property while on GoneChatting.
            GoneChatting takes a strong stance against hate speech, rude or
            abusive behavior, bullying, and misogyny. You should behave the same
            way on GoneChatting as you would in real life. Additionally, we
            encourage all of our users to report anyone who does not follow
            these behavioral guidelines.
          </Text>
          <Text bold>Don't pretend you're someone you're not</Text>
          <Text>
            Do not post photos that are not of you. We also recommend using our
            photo verification tool to let other users know that your profile is
            legit.
          </Text>
          <Text>GoneChatting photo guidelines:</Text>
          <ul>
            <li>
              <Text>
                No kids on their own. They must be in the photo with an adult,
                and fully clothed.
              </Text>
            </li>
            <li>
              <Text>No photos in bikinis/swimwear indoors.</Text>
            </li>
            <li>
              <Text>No pictures in underwear.</Text>
            </li>
            <li>
              <Text>No shirtless/underwear mirror selfies.</Text>
            </li>
            <li>
              <Text>Face must be clearly visible in all photos.</Text>
            </li>
            <li>
              <Text>No watermarks or text overlaid.</Text>
            </li>
            <li>
              <Text>No pornographic material.</Text>
            </li>
            <li>
              <Text>No graphic hunting photos.</Text>
            </li>
            <li>
              <Text>No guns.</Text>
            </li>
          </ul>
          <Text bold>Don’t do anything illegal on our site</Text>
          <Text>
            Illegal activity will not be tolerated on GoneChatting. This may
            result in being banned or restricted from the site, and/or being
            reported to the authorities.
          </Text>
          <Text bold>No soliciting</Text>
          <Text>
            GoneChatting isn’t for selling things. If you try to use it as a
            marketplace, you’ll be banned.
          </Text>
          <Text bold>
            No kids on their own, they must be in the photo with an adult &
            fully clothed
          </Text>
          <Text>
            GoneChatting is for 18+ years, therefore we don’t allow kids to be
            alone in photos as representatives of their parents on GoneChatting.
            In addition, all children must be completely clothed. This is safer
            for both children and their parents.
          </Text>
          <Text bold center fontSize={FONT_SIZES.X_LARGE}>
            6. Restrictions on the App
          </Text>
          <Text>You agree to:</Text>
          <ul>
            <li>
              <Text>
                comply with all applicable laws, including without limitation,
                privacy laws, intellectual property laws, anti-spam laws, equal
                opportunity laws and regulatory requirements;
              </Text>
            </li>
            <li>
              <Text>
                use your real name and real age in creating your GoneChatting
                account and a username for your alias on your profile;
              </Text>
            </li>
            <li>
              <Text>use the services in a professional manner.</Text>
            </li>
          </ul>
          <Text>You agree that you will not:</Text>
          <ul>
            <li>
              <Text>
                act in an unlawful or unprofessional manner including being
                dishonest, abusive or discriminatory;
              </Text>
            </li>
            <li>
              <Text>
                misrepresent your identity, your age, your current or previous
                positions, qualifications or affiliations with a person or
                entity;
              </Text>
            </li>
            <li>
              <Text>
                disclose information that you do not have the consent to
                disclose;
              </Text>
            </li>
            <li>
              <Text>stalk or harass any other user of the App;</Text>
            </li>
            <li>
              <Text>
                create or operate a pyramid scheme, fraud or other similar
                practice;
              </Text>
            </li>
            <li>
              <Text>
                develop, support or use software, devices, scripts, robots,
                other types of mobile code or any other means or processes
                (including crawlers, browser plugins and add-on or other
                technology) to scrape or otherwise exfiltrate from GoneChatting
                or its services, or otherwise copy profiles and other data from
                the services.
              </Text>
            </li>
          </ul>
          <Text>
            We don’t like users misbehaving in the GoneChatting community. You
            can report any abuse or complain about Member Content by contacting
            us, outlining the abuse and/or complaint. You can also report a user
            directly from a profile or in chat by clicking the ‘Block & Report’
            link. We reserve the right to investigate any possible violations of
            these Terms, any GoneChatting user’s rights, or any third-party
            rights and we may, in our sole discretion, immediately terminate any
            user’s right to use of the App without prior notice, as set out
            further in Section 3 above, and/or remove any improper, infringing
            or otherwise unauthorized Member Content submitted to the App.
          </Text>
          <Text>
            We don’t control any of the things our users say or do, so you are
            solely responsible for your interactions with other users of the
            App.
          </Text>
          <Text bold>
            YOU UNDERSTAND THAT GONECHATTING GROUP DOES NOT CURRENTLY CONDUCT
            CRIMINAL BACKGROUND CHECKS ON ITS USERS. GONECHATTING GROUP ALSO
            DOES NOT INQUIRE INTO THE BACKGROUNDS OF ITS USERS OR ATTEMPT TO
            VERIFY THE STATEMENTS OF ITS USERS. GONECHATTING GROUP MAKES NO
            REPRESENTATIONS OR WARRANTIES AS TO THE CONDUCT OF ANY USERS OR
            THEIR COMPATIBILITY WITH ANY CURRENT OR FUTURE USERS. GONECHATTING
            GROUP RESERVES THE RIGHT TO CONDUCT ANY CRIMINAL BACKGROUND CHECK OR
            OTHER SCREENINGS (SUCH AS SEX OFFENDER REGISTRATION SEARCHES) AT ANY
            TIME AND TO USE AVAILABLE PUBLIC RECORDS FOR ANY PURPOSE.
          </Text>
          <Text>
            You agree to, and hereby do, release GoneChatting Group and its
            successors from any claims, demands, losses, damages, rights, and
            actions of any kind, including personal injuries, death and property
            damage, that either directly or indirectly arises from your
            interactions with or conduct of other users of the App. If you are a
            California resident, you hereby waive California Civil Code Section
            1542, which states, “A general release does not extend to claims
            that the creditor or releasing party does not know or suspect to
            exist in his or her favor at the time of executing the release and
            that, if known by him or her, would have materially affected his or
            her settlement with the debtor or released party.” The foregoing
            release does not apply to any claims, demands, or any losses,
            damages, rights and actions of any kind, including personal
            injuries, death or property damage for any unconscionable commercial
            practice by GoneChatting Group or for such party’s fraud, deception,
            false promise, misrepresentation or concealment, suppression or
            omission of any material fact in connection with the App.
          </Text>
          <Text bold center fontSize={FONT_SIZES.X_LARGE}>
            8. Changes to Terms
          </Text>
          <Text>
            GoneChatting may update these Terms from time to time. We will
            notify you of any changes by posting the new Terms on this page. You
            are advised to review these Terms periodically for any changes.
            Changes to these Terms are effective when they are posted on this
            page.
          </Text>
          <Text bold center fontSize={FONT_SIZES.X_LARGE}>
            9. Contact Us
          </Text>
          <Text>
            If you have any questions about these Terms, please contact us at{" "}
            <Text bold>support@gonechatting.com</Text>.
          </Text>
        </Box>
        {!state.currentUser.terms ? (
          <Box width={"100%"} justifyContent="space-between">
            <Button
              coolStyle
              onClick={onClose}
              color={COLORS.red}
              style={{
                borderRadius: 12,
                width: "40%",
                border: `solid 1px ${COLORS.white}`,
                boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
              }}
            >
              <Text bold>Cancel</Text>
            </Button>
            <Button
              onClick={handleAcceptTerms}
              coolStyle
              color={COLORS.main}
              style={{
                borderRadius: 12,
                width: "40%",
                border: `solid 1px ${COLORS.white}`,
                boxShadow: `2px 2px 4px 2px rgba(0, 0, 0, 0.3)`,
              }}
            >
              <Text bold>Accept</Text>
            </Button>
          </Box>
        ) : (
          <Text>Already Agreed ✅ </Text>
        )}
      </Box>
    </Modal>
  );
};

export default TermsAgreement;
